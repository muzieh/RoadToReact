import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const ToDo = function (title) {
  this.title = title;
  this.done = false;
  this.guid = Math.floor(Math.random() * 10000000);
  return this;
};

const todos = [new ToDo("sniadanie"), new ToDo("obiad"), new ToDo("React")];

const rootElement = document.getElementById("root");
ReactDOM.render(<App todos={todos} />, rootElement);
