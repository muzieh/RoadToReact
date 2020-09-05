import React from "react";
import "./styles.css";
import InputWithLabel from "./InputWithLabel";

const useSemitPersistentState = (key, initialValue) => {
  console.log(`seSemiPersistentState key:${key} initialValue:${initialValue}`);
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialValue
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const Item = ({ item, onRemoveItem }) => {
  console.log(`Item init ${item.guid}`);

  return (
    <li>
      {item.title}
      <input type="checkbox" value={item.done} />
      <span>
        <button
          type="button"
          onClick={() => {
            onRemoveItem(item);
          }}
        >
          dismiss
        </button>
      </span>
    </li>
  );
};
const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.guid} onRemoveItem={onRemoveItem} item={item} />
      ))}
    </ul>
  );
};

const ToDo = function (title) {
  this.title = title;
  this.done = false;
  this.guid = Math.floor(Math.random() * 10000000);
  return this;
};

const initialTodos = [
  new ToDo("sniadanie"),
  new ToDo("obiad"),
  new ToDo("React")
];

export default function App(props) {
  const [searchTerm, setSearchTerm] = useSemitPersistentState(
    "search",
    "React"
  );
  const [todos, setTodos] = React.useState(initialTodos);
  const handleSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const searchedTodos = todos.filter((todo) => todo.title.includes(searchTerm));

  const handleRemoveItem = ({ guid }) => {
    console.log(`removing ${guid}`);
    setTodos(todos.filter((todo) => todo.guid !== guid));
  };

  return (
    <div className="App">
      <InputWithLabel
        onInputChange={handleSearchTerm}
        value={searchTerm}
        id="search"
        label="search"
      >
        <span>Search :</span>
      </InputWithLabel>
      <List list={searchedTodos} onRemoveItem={handleRemoveItem} />
    </div>
  );
}
