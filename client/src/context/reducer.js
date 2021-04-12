import {ADD_USER,REMOVE_USER,ADD_POST,REMOVE_POST} from "./action.types";

export const initialState = null;

export const reducer = (state,action) => {
    switch(action.type){
        case ADD_USER:
            return action.payload
        case REMOVE_USER:
            return initialState
        default:
            return state
    }
}

export const postReducer = (postState,action) => {
    switch(action.type){
        case ADD_POST:
            return action.payload
        case REMOVE_POST:
            return initialState
        default:
            return postState
    }
}