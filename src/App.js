import React from "react";
import "./styles.css";
import Search from "./Search";

const useSemiPersistentState = (key, initialValue) => {
  console.log(`seSemiPersistentState key:${key} initialValue:${initialValue}`);
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialValue
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const Item = ({ guid, title, done }) => {
  return (
    <li>
      {title}
      <input type="checkbox" value={done} />
    </li>
  );
};
const List = ({ todos }) => {
  return (
    <ul>
      {todos.map(({ guid, ...todo }) => (
        <Item key={guid} {...todo} />
      ))}
    </ul>
  );
};

export default function App(props) {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    "search",
    "Reactor"
  );
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
