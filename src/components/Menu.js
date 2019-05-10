import React from "react";
import axios from "axios";

//import "../assets/css/menu.css";

//IMPORT JS
import { createData } from "./createData.js";

class Menu extends React.Component {
  state = {
    collapsed: false,
    categories: [],
    list: "",
    categoriesKeys: ""
  };

  test = data => {
    console.log("teeeest", data);
  };

  //handle displaying list of values when clicking on button
  //search for list of values within object
  handleSearch = (obj, next, event) => {
    // console.log(event.target.name);
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === "object") {
        if (next === key) {
          //create DOM  CHILDREN
          createData(Object.keys(obj[key]), key, this.test, event);
        }
        this.handleSearch(obj[key], next);
      }
    });
  };

  componentDidMount() {
    axios.get("https://www.ifixit.com/api/2.0/categories").then(response => {
      this.setState({ categories: response.data });
    });
  }

  render() {
    return (
      <React.Fragment>
        {/* display list of things */}
        <div id="high" className="columns is-multiline">
          {Object.keys(this.state.categories).map(key => (
            <div className="column is-4">
              <div
                name="col"
                className="block1"
                onClick={event =>
                  this.handleSearch(this.state.categories, key, event)
                }
              >
                {key}
              </div>
              <div name={key + "1"} />
            </div>
          ))}
        </div>
        {/* <div>{iterate(categories)}</div> */}
      </React.Fragment>
    );
  }
}

export default Menu;
