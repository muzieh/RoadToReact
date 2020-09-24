import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';

import App, {todosReducer, Item} from "./App";


const storyOne = {objectID: 43, title:"CoolBook", author: "Marcin", points:123};
const storyTwo = {objectID: 123};

describe('App component', () => {
    it('expect true to be true', () => {
        expect(true).toBe(true);
    });

    it('remove an item when dismiss button clicked', () => {

    });

    it('fetch some initial items', () => {
        expect(true).toBe(true);
    });

    it('remove story from all stries', () => {
        const state = {list: [storyOne, storyTwo]}
        const newState = {list: [storyOne]};

        const action = {type: "TODO_REMOVE", payload: storyTwo};
        expect(todosReducer(state, action)).toStrictEqual(newState);
    });

    it('rendered App contains ToDo1', () => {
      render(<Item item={storyOne} onRemoveItem={() => {}}></Item>);
      expect(screen.getByText(storyOne.author)).toBeInTheDocument();
      screen.debug();
    });
});

