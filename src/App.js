import React from "react";
import axios from "axios";
import "./styles/styles.scss";

class App extends React.Component {
  state = {
    devices: [],
    bag: [],
    objectKeys: null,
    tempKeys: []
  };

  //take in search value
  onChange = e => {
    const { value } = e.target;
    this.setState({
      search: value
    });

    this.search(value);
  };

  //search for typed query
  search = search => {
    const url = `https://www.ifixit.com/api/2.0/suggest/${search}?doctypes=device`;
    fetch(url)
      .then(results => results.json())
      .then(data => {
        this.setState({ devices: data.results });
      });
  };

  //add selected device to bag
  addDevice = (e, deviceTitle) => {
    const array = Array.from(this.state.bag || []);
    //only add if item is not already in bag
    if (array.indexOf(deviceTitle) === -1) {
      array.push(deviceTitle);
    } else {
      return;
    }
    localStorage.setItem("list", JSON.stringify(array));
    this.setState({
      bag: array
    });
  };

  //remove selected device from bag
  removeDevice = (e, deviceTitle) => {
    this.setState(prevState => ({
      bag: prevState.bag.filter(d => d !== deviceTitle)
    }));

    let removedDeviceArray = JSON.parse(localStorage.getItem("list"));
    removedDeviceArray.splice(removedDeviceArray.indexOf(deviceTitle), 1);
    localStorage.setItem("list", JSON.stringify(removedDeviceArray));
  };

  //clear contents of bag
  removeAll = e => {
    this.setState({
      bag: []
    });

    let clearedArray = JSON.parse(localStorage.getItem("list"));
    clearedArray = [];
    localStorage.setItem("list", JSON.stringify(clearedArray));
  };

  //create the next layer of nested menu recursively
  makeMenuLayer = layer => {
    const { objectKeys } = this.state;
    if (layer == null) {
      //used to fix null object error
      return null;
    }
    const layerKeys = Object.entries(layer).map(([key, value]) => {
      //if object has children, display arrow icon, else do nothing
      var arrow = Object.keys(value).length ? (
        <i
          className="fas fa-angle-right"
          style={{ cursor: "pointer", color: "gray" }}
        />
      ) : (
        ""
      );
      //if object doesn't have children, display + icon, else do nothing
      var plus =
        Object.keys(value).length === 0 ? (
          <i
            className="fas fa-plus plus"
            style={{ cursor: "pointer" }}
            onClick={e => this.addDevice(e, key)}
          />
        ) : (
          ""
        );
      return (
        <ul className="menu-items" key={key}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => this.handleShowMore(key)}
          >
            {key} {arrow} {plus}
          </div>

          {objectKeys[key] && this.makeMenuLayer(value)}
        </ul>
      );
    });
    return <div>{layerKeys}</div>;
  };

  handleShowMore = key => {
    this.setState(prevState => ({
      objectKeys: {
        ...prevState.objectKeys,
        [key]: !this.state.objectKeys[key]
      }
    }));
  };

  initializeTempKeys = layer => {
    if (layer == null) {
      return null;
    }
    // eslint-disable-next-line
    Object.entries(layer).map(([key, value]) => {
      const newTempKeys = this.state.tempKeys;
      newTempKeys.push(key);
      this.setState({ tempKeys: newTempKeys });
      this.initializeTempKeys(value);
    });
  };

  initializeObjectKeys = () => {
    const { tempKeys } = this.state;
    let tempObject = {};
    tempKeys.forEach(tempKey => {
      tempObject[tempKey] = true;
    });

    this.setState({ objectKeys: tempObject });
  };

  componentDidMount() {
    this.search("");
    const storedList = JSON.parse(localStorage.getItem("list"));
    const bag = storedList;
    this.setState({ bag });

    //api call to categories for menu
    axios.get("https://www.ifixit.com/api/2.0/categories").then(response => {
      this.setState({ categories: response.data });
    });
    const { categories } = this.state;
    this.initializeTempKeys(categories);
    this.initializeObjectKeys();
    this.setState({ categories });
  }

  render() {
    return (
      <div className="text">
        {/*header containing logo & title */}
        <header className="header">
          <img
            className="header-img"
            align="left"
            src={"ifixit-logo.png"}
            alt="Logo"
          />
          <h>GRAB BAG</h>
        </header>

        {/* div for search bar, menu, and bag */}
        <div className="flex-container">
          <h3>Search for a device...</h3>

          {/* bag and remove all button */}
          <h3 className="your-bag">
            <span>Your Bag</span>
            <button className="btn button" onClick={e => this.removeAll(e)}>
              Remove all
            </button>
          </h3>
        </div>

        <div className="flex-container">
          <form>
            <input
              className="rounded search"
              type="text"
              placeholder="Search"
              onChange={this.onChange}
            />
            {/* add devices from search bar */}
            <div>
              {(this.state.devices || []).map(device => (
                // eslint-disable-next-line
                <a key={device.title}>
                  <li>
                    {device.title}{" "}
                    <i
                      className="fas fa-plus plus input"
                      style={{ cursor: "pointer" }}
                      onClick={e => this.addDevice(e, device.title)}
                    />
                  </li>
                </a>
              ))}
              {/* create menu using categories */}
              <h4>Or browse for a device...</h4>
              <div className="menu">
                {this.makeMenuLayer(this.state.categories)}
              </div>
            </div>
          </form>
          {/* populated/unpopulated bag and single device removal */}
          <div className="bag">
            <div>
              {(this.state.bag || []).map(device => (
                <p key={device}>
                  {device}
                  <i
                    className="fas fa-times ex"
                    style={{ cursor: "pointer" }}
                    onClick={e => this.removeDevice(e, device)}
                  />
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
