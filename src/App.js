import React from "react";
import "./App.css";
//import axios from "axios";
//https://www.ifixit.com/api/2.0/categories/all

class App extends React.Component {
  state = {
    search: "",
    devices: []
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
      <form>
        <input
          type="text"
          placeholder="Search for devices..."
          onChange={this.onChange}
        />
        {this.state.devices.map(device => (
          <ul key={device.title}>
            <li>{device.title}</li>
          </ul>
        ))}
      </form>
    );
  }
}

export default App;
