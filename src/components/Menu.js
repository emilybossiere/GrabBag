import React from "react";
import axios from "axios";

class Menu extends React.Component {
  state = {
    collapsed: false,
    categories: [],
    list: ""
  };

  componentDidMount() {
    axios.get("https://www.ifixit.com/api/2.0/categories").then(response => {
      this.setState({ categories: response.data });
      var temp = response.data;
      //   const temp1 = temp.map((value, index) =>{

      //   })
      console.log("FIRST LAYER: ", temp);
      console.log("FIRST LAYER: ", Object.values(temp)[0]);
      console.log("SECOND LAYER: ", Object.values(temp)[0]);
      console.log("THIRD LAYER: ", Object.values(Object.values(temp)[0]));

      let mainLayer = [];
      let innerValues = temp;
      let innerLayer = temp;
      //save html to be rendered

      
      

      for (let i = 0; i < Object.keys(temp).length; i++) {
        //fetch another layer
        innerLayer  =Object.values(temp)[i];        
        console.log("INNER LAYER ",innerLayer);
        innerValues = Object.keys(innerLayer);
        //go here to fetch values in deeper layer
        for (let j = 0; j < innerValues.length; j++) {
            console.log(innerValues[j]);
        }
      }
    });
  } //this.setState({ categories: response.data})

  render() {
    //const { categories } = this.state;

    const { categories } = this.state;
    const iterate = categories => {
      Object.keys(categories).forEach(key => {
        //console.log(key);
        console.log(`key: ${key}`);
        if (typeof categories[key] === "object") {
          iterate(categories[key]);
        }
      });
    };

    // const { categories } = this.state;
    // for (var key in categories) {
    //   if (categories.hasOwnProperty(key)) {
    //     console.log(key + "->" + categories[key]);
    //   }
    // }
    //const { categories } = this.state;

    const categoriesKeys = Object.keys(categories).map(key => {
      //console.log(categories[key]); //2nd level-on
      return <div key={key}>{JSON.stringify(categories[key])}</div>;
    });

    return (
      <React.Fragment>
        {this.state.list}
        <div>{iterate(categories)}</div>
      </React.Fragment>
    );
  }
}

export default Menu;
