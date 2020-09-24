import {todosReducer} from "./App";

const storyOne = {objectID: 43};
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
});

