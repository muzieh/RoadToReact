import React from "react";
import axios from 'axios';
import styled from 'styled-components';
import style from './App.module.css';
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
  return (
    <div style={{display:'flex'}}>
      <span style={{width: '40%'}}>
        <a href={item.url}> {item.title || <span>no title</span>} - {date} </a>
      </span>
      <span style={{width: '30%'}}>{item.author}</span>
      <span style={{width: '10%'}}>{item.num_comments}</span>
      <span style={{width: '10%'}}>{item.points}</span>
      <span style={{width: '10%'}}>
        <button type="button" onClick={() => { onRemoveItem(item); }} >
          Dismiss
        </button>
      </span>
    </div>
  );
};

const List = ({ list, onRemoveItem }) => {
  return (
    <div>
        <div style={{ display: 'flex' }} className={style.list__header}>
          <span style={{ width: '40%' }}>Title</span>
          <span style={{ width: '30%' }}>Author</span>
          <span style={{ width: '10%' }}>Comments</span>
          <span style={{ width: '10%' }}>Points</span>
          <span style={{ width: '10%' }}>Actions</span>
        </div>
        {list.map((item) => (
          <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
        ))}
    </div>
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
  const StyledContainer = styled.div`
    color:grey;
  `;

  return (
    <StyledContainer className="App">
      <form onSubmit={handleSearchSubmit}>
        <InputWithLabel
            onInputChange={handleSearchTerm}
            value={searchTerm}
            id="search"
            label="search"
        >
          <span style={{fontWeight:'bold'}}>Search :</span>
        </InputWithLabel>
        <button type="submit" disabled={!searchTerm} >Submit</button>
      </form>
      {todos.isError && <div>error</div>}
      {todos.isLoading ? (
        <div className={style.ajaxLoader}>Loading</div>
      ) : (
        <List list={todos.list} onRemoveItem={handleRemoveItem} />
      )}
    </StyledContainer>
  );
}
