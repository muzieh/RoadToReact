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
  console.log(`Item init ${item.objectID}`);
  const date = (new Date(item.created_at)).getFullYear();
  debugger;
  return (
    <li>
      <a href={item.url}>
      {item.title} - {date}
      </a>
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
        <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
      ))}
    </ul>
  );
};


const todosReducer = (state, action) => {
  switch(action.type) {
    case 'TODOS_FETCH_INIT':
      return {...state, isLoading: true, isError: false};
    case 'TODOS_FETCH_SUCCESS':
      return {...state, list: action.payload, isLoading: false, isError: false};
    case 'TODOS_FETCH_FAILURE':
      debugger;
      return {...state, isLoading: false, isError: true, list:[]};
    case 'TODO_REMOVE':
      const {objectID} = action.payload;
      const newList = state.list.filter(todo => todo.objectID !== objectID);
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

  React.useEffect(() => {
    dispatchTodos({type: 'TODOS_FETCH_INIT'})

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(response => response.json())
      .then(result => dispatchTodos({type: 'TODOS_FETCH_SUCCESS', payload: result.hits}))
      .catch(err => dispatchTodos({type: 'TODOS_FETCH_FAILURE', payload:err}))
    //getTodosAsync()
      //.then((result) => dispatchTodos({type: 'TODOS_FETCH_SUCCESS', payload:result.data.todos}))
      //.catch(result => dispatchTodos({type: 'TODOS_FETCH_FAILURE'}));
  }, [searchTerm]);

  //const searchedTodos = todos.list.filter((todo) => todo.title && todo.title.toLowerCase().includes(searchTerm));

  const handleRemoveItem = ({ objectID }) => {
    debugger;
    console.log(`removing ${objectID}`);
    dispatchTodos({type:'TODO_REMOVE', payload: {objectID: objectID}})
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
        <List list={todos.list} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
}
