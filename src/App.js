import React from "react";
import "./App.css";
//import axios from "axios";

class App extends React.Component {
  state = {
    search: "",
    devices: [],
    bag: []
  };

  addDevice = (e, deviceTitle) => {
    console.log(deviceTitle);
    this.setState(prevState => ({
      bag: [...prevState.bag, deviceTitle]
    }));
  };

  removeDevice = (e, deviceTitle) => {
    this.setState(prevState => ({
      bag: prevState.bag.filter(d => d !== deviceTitle)
    }));
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
      </div>
    );
  }
}

export default App;
