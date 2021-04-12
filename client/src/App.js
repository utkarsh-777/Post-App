import React, { useContext, useEffect, useReducer } from "react";
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css';

import {BrowserRouter as Router,Route,Switch, useHistory} from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";

import { initialState, postReducer, reducer } from "./context/reducer";
import { PostContext, UserContext } from "./context/context";
import axios from "axios";

import {localURL} from "./serverUrl"
import { ADD_USER } from "./context/action.types";
import LikedPost from "./components/likedPost";
import UnlikedPost from "./components/unlikedPost";
import Profile from "./components/profile";
import Update from "./components/update";
import Create from "./components/createPost";
import Search from "./components/searchPost";


const Routing = () => {
  const {dispatch} = useContext(UserContext);
  const token = localStorage.getItem('token');
  const history = useHistory();

  useEffect(()=>{
    if(token){
      axios.get(`${localURL}/user`,{
        headers:{
          Authorization:token
        }
      }).then(res=>{
        if(res.data.error){
          history.push('/login')
        }
        dispatch({type:ADD_USER,payload:res.data.user});
      })
    }else{
      history.push('/login')
    }
  },[dispatch,history,token])
    
  return(
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/liked-post" component={LikedPost} />
        <Route exact path="/unliked-post" component={UnlikedPost} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path='/update' component={Update} />
        <Route exact path='/create-post' component={Create} />
        <Route exact path='/search-posts' component={Search} />
      </Switch>
  )
}

const App = () => {
  const [state,dispatch] = useReducer(reducer,initialState);
  const [postState,postDispatch] = useReducer(postReducer,initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
        <PostContext.Provider value={{postState,postDispatch}}>
        <Router>
          <Routing />
        </Router>
        </PostContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
