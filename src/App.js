import React from "react";
import Menu from "./components/Menu";
import "./styles/styles.scss";

class App extends React.Component {
  state = {
    devices: [],
    bag: [],
    objectKeys: null,
    tempKeys: []
  };

  onChange = e => {
    const { value } = e.target;
    this.setState({
      search: value
    });

    this.search(value);
  };

  search = search => {
    const url = `https://www.ifixit.com/api/2.0/suggest/${search}?doctypes=device`;
    fetch(url)
      .then(results => results.json())
      .then(data => {
        this.setState({ devices: data.results });
      });
  };

  addDevice = (e, deviceTitle) => {
    const array = Array.from(this.state.bag || []);
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

  removeDevice = (e, deviceTitle) => {
    this.setState(prevState => ({
      bag: prevState.bag.filter(d => d !== deviceTitle)
    }));

    let removedDeviceArray = JSON.parse(localStorage.getItem("list"));
    removedDeviceArray.splice(removedDeviceArray.indexOf(deviceTitle), 1);
    localStorage.setItem("list", JSON.stringify(removedDeviceArray));
  };

  removeAll = e => {
    this.setState({
      bag: []
    });

    let clearedArray = JSON.parse(localStorage.getItem("list"));
    clearedArray = [];
    localStorage.setItem("list", JSON.stringify(clearedArray));
  };

  componentDidMount() {
    this.search("");
    const storedList = JSON.parse(localStorage.getItem("list"));
    const bag = storedList;
    this.setState({ bag });
  }
  render() {
    return (
      <div className="text">
        <header className="header">
          <img
            className="header-img"
            align="left"
            src={"ifixit-logo.png"}
            alt="Logo"
          />
          GRAB BAG
        </header>
        <div className="flex-container">
          <h3>Search for a device</h3>
          <h3>
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
              placeholder="Search..."
              onChange={this.onChange}
            />
            <div className="search-results">
              {(this.state.devices || []).map(device => (
                // eslint-disable-next-line
                <a key={device.title}>
                  <li>
                    {device.title}{" "}
                    <i
                      className="fas fa-plus plus input"
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={e => this.addDevice(e, device.title)}
                    />
                  </li>
                </a>
              ))}
            </div>
            <Menu addDevice={this.addDevice}/>
          </form>
                
          <div>
            <div>
              {(this.state.bag || []).map(device => (
                <p key={device.title}>
                  {device}
                  <i
                    className="fas fa-times ex"
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={e => this.removeDevice(e, device)}
                  />
                </p>
              ))}
            </div>
          </div>
        </div>

        {/*<Menu />*/}
      </div>
    );
  }
}

export default App;
