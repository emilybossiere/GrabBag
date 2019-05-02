import React from "react";
import "./styles/styles.scss";

class App extends React.Component {
  state = {
    search: "",
    devices: [],
    bag: []
  };

  addDevice = (e, deviceTitle) => {
    const array = Array.from(this.state.bag);
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

  componentDidMount() {
    this.search("");
    const storedList = JSON.parse(localStorage.getItem("list"));
    console.log(storedList);
    const bag = storedList;
    this.setState({ bag });
  }
  render() {
    return (
      <div>
        <form>
          <input
            type="text"
            placeholder="Search for devices..."
            onChange={this.onChange}
          />
          {this.state.devices.map(device => (
            <ul key={device.title}>
              <p>
                {device.title}{" "}
                <i
                  className="fas fa-plus"
                  style={{ cursor: "pointer", color: "green" }}
                  onClick={e => this.addDevice(e, device.title)}
                />
              </p>
            </ul>
          ))}
        </form>
        {this.state.bag.map(device => (
          <p key={device.title}>
            {device}
            <i
              className="fas fa-times"
              style={{ cursor: "pointer", color: "red" }}
              onClick={e => this.removeDevice(e, device)}
            />
          </p>
        ))}
        <button onClick={e => this.removeAll(e)}>Remove all</button>
      </div>
    );
  }
}

export default App;
