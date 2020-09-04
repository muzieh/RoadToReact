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
    },[key, value])

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
  const [searchTerm, setSearchTerm] = useSemitPersistentState('search', 'React');

  const handleSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const searchedTodos = props.todos.filter((todo) =>
    todo.title.includes(searchTerm)
  );

  return (
    <div className="App">
      <InputWithLabel onInputChange={handleSearchTerm} value={searchTerm} id="search" label="search" />
      <List todos={searchedTodos} />
    </div>
  );
}
