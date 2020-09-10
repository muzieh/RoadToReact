import React from "react";
import "./styles.css";
import InputWithLabel from "./InputWithLabel";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
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

const todosReducer = (state, action) => {
  debugger;
  switch(action.type) {
    case 'TODOS_FETCH_INIT':
      return {...state, isLoading: true, isError: false};
    case 'TODOS_FETCH_SUCCESS':
      debugger;
      return {...state, list: action.payload, isLoading: false, isError: false};
    case 'TODOS_FETCH_FAILURE':
      debugger;
      return {...state, isLoading: false, isError: true, list:[]};
    case 'TODO_REMOVE':
      debugger;
      const {guid} = action.payload;
      const newList = state.list.filter(todo => todo.guid !== guid);
      return {...state, list: newList};
    default:
     throw new Error();
  }
}

export default function App(props) {
  const [searchTerm, setSearchTerm] = useSemitPersistentState(
    "search",
    ""
  );

  //const [todos, setTodos] = React.useState([]);
  const [todos, dispatchTodos] = React.useReducer(todosReducer, {
    list: [],
    isLoading: true,
    isError:false
  });

  console.log(todos);
  //const [isLoading, setIsLoading] = React.useState(true);

  const handleSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const getTodosAsync = () => {
    return new Promise(
      (resolve) =>
        setTimeout(() => {
          //reject('sdf');
          resolve({ data: { todos: initialTodos } });
        },3000)
    );
  };

  React.useEffect(() => {
    dispatchTodos({type: 'TODOS_FETCH_INIT'})

    fetch(`${API_ENDPOINT}`)
      .then(response => response.json())
      .then(result => dispatchTodos({type: 'TODOS_FETCH_SUCCESS', payload: result.hits}))
      .catch(err => dispatchTodos({type: 'TODOS_FETCH_FAILURE', payload:err}))
    //getTodosAsync()
      //.then((result) => dispatchTodos({type: 'TODOS_FETCH_SUCCESS', payload:result.data.todos}))
      //.catch(result => dispatchTodos({type: 'TODOS_FETCH_FAILURE'}));
  }, []);

  const searchedTodos = todos.list.filter((todo) => todo.title.includes(searchTerm));

  const handleRemoveItem = ({ guid }) => {
    debugger;
    console.log(`removing ${guid}`);
    dispatchTodos({type:'TODO_REMOVE', payload: {guid: guid}})
    //setTodos(todos.filter((todo) => todo.guid !== guid));
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
      {todos.isError && <div>error</div>}
      {todos.isLoading ? (
        <div>Loading</div>
      ) : (
        <List list={searchedTodos} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
}
