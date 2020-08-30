import React from "react";
import "./styles.css";
import Search from "./Search";

const List = (props) => {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li key={todo.guid}>
          {todo.title} {todo.guid}
          <input type="checkbox" value={todo.done} />
        </li>
      ))}
    </ul>
  );
};

export default function App(props) {
  const [searchTerm, setSearchTerm] = React.useState("React");
  const handleSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const searchedTodos = props.todos.filter((todo) =>
    todo.title.includes(searchTerm)
  );

  return (
    <div className="App">
      <Search onSearch={handleSearchTerm} search={searchTerm} />
      <List todos={searchedTodos} />
    </div>
  );
}
