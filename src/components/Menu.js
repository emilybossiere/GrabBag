import React from "react";
import axios from "axios";
//import FontAwesome from "react-fontawesome";

class MenuTest extends React.Component {
  state = {
    categories: [],
    objectKeys: null,
    tempKeys: []
  };

  makeMenuLayer = layer => {
    const { objectKeys } = this.state;
    const layerKeys = Object.entries(layer).map(([key, value]) => {
      var arrow = Object.keys(value).length ? (
        <i
            className="fas fa-angle-right"
            style={{ cursor: "pointer", color: "gray" }}
          />
      ) : (
        ""
      );
      var ex =
        Object.keys(value).length === 0 ? (
          <i
            className="fas fa-plus"
            style={{ cursor: "pointer", color: "green" }}
          />
        ) : (
          ""
        );
      return (
        <ul key={key}>
          <div onClick={() => this.handleShowMore(key)}>
            {key} {arrow} {ex}
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
    axios.get("https://www.ifixit.com/api/2.0/categories").then(response => {
      this.setState({ categories: response.data });
    });
    const { categories } = this.state;
    this.initializeTempKeys(categories);
    this.initializeObjectKeys();
    this.setState({ categories });
  }

  render() {
    const { categories } = this.state;
    return <div>{this.makeMenuLayer(categories)}</div>;
  }
}

export default MenuTest;
