import React from "react";
import axios from 'axios';

import "./styles.scss";
import "./list.scss";
import styles from "./App.module.scss";

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
  return (
    <li className='list-element'>
      <a href={item.url} className='list-element-link'>
      {item.title || <span>no title</span>} - {date}
      </a>
      <input type="checkbox" value={item.done} />
      <span>
        <button className="button"
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
    <ul className='list'>
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
      return {...state, isLoading: false, isError: true, list:[]};
    case 'TODO_REMOVE':
      const {objectID} = action.payload;
      const newList = state.list.filter(todo => todo.objectID !== objectID);
      return {...state, list: newList};
    default:
     throw new Error();
  }
}

export default function App() {
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

  const [url, setUrl] = React.useState(
`${API_ENDPOINT}${searchTerm}`
  );

  console.log(todos);
  //const [isLoading, setIsLoading] = React.useState(true);

  const handleSearchTerm = (searchTerm) => {
    setSearchTerm(searchTerm);
  };
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }
  const handleFetchTodos = React.useCallback(async () => {
    dispatchTodos({type: 'TODOS_FETCH_INIT'})
    try {
      const result = await axios.get(url);
      dispatchTodos({type: 'TODOS_FETCH_SUCCESS', payload: result.data.hits})
    } catch(err) {
      dispatchTodos({type: 'TODOS_FETCH_FAILURE', payload:err})
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchTodos();
  }, [handleFetchTodos]);

  //const searchedTodos = todos.list.filter((todo) => todo.title && todo.title.toLowerCase().includes(searchTerm));

  const handleRemoveItem = ({ objectID }) => {
    console.log(`removing ${objectID}`);
    dispatchTodos({type:'TODO_REMOVE', payload: {objectID: objectID}})
    //setTodos(todos.filter((todo) => todo.guid !== guid));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>Books !!</h1>
      <form onSubmit={handleSearchSubmit}>
        <InputWithLabel
            onInputChange={handleSearchTerm}
            value={searchTerm}
            id="search"
            label="search"
        >
          <span>Search :</span>
        </InputWithLabel>
        <button type="submit" disabled={!searchTerm} >Submit</button>
      </form>
      {todos.isError && <div>error</div>}
      {todos.isLoading ? (
        <div>Loading</div>
      ) : (
        <List list={todos.list} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
}
