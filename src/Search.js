import React from "react";

export default function Search(props) {
  return (
    <section>
      <label htmlFor="search">Search</label>
      <input
        input="search"
        type="text"
        onChange={(event) => props.onSearch(event.target.value)}
        value={props.search}
      />
      <p>
        Searching for <strong>{props.search}</strong>
      </p>
    </section>
  );
}
