import React from "react";
import Search from "./components/Search";
import "./styles/styles.scss";

class App extends React.Component {
  state = {
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

  componentDidMount() {
    const storedList = JSON.parse(localStorage.getItem("list"));
    const bag = storedList;
    this.setState({ bag });
  }
  render() {
    return (
      <div>
        <Search addDevice={this.addDevice} />

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
