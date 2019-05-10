var index = 1;
export function createData(data, key, search, e) {
  console.log("search ", search);
  console.log("e", e);
  e.stopPropagation();
  console.log("cool data ", data);
  let parent = document.getElementsByName(key + "1");
  console.log("parent[0]", parent[0]);
  //create elements and append them
  for (let i = 0; i < data.length; i++) {
    let wrapper = document.createElement("ul");
    wrapper.innerHTML = data[i];
    wrapper.name = data[i] + index + 1;
    wrapper.addEventListener("click", search(data[i]));
    parent[0].append(wrapper);
  }
}
