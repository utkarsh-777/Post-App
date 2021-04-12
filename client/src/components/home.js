import React, { useContext, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { PostContext, UserContext } from "../context/context";
import MenuExampleSecondary from "./menu";
import { Card, Icon } from 'semantic-ui-react';
import axios from "axios";

import {localURL} from "../serverUrl";
import { ADD_POST } from "../context/action.types";

const Home = () => {
    const {state} = useContext(UserContext);
    const {postState,postDispatch} = useContext(PostContext);

    useEffect(()=>{
        axios.get(`${localURL}/all-posts`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>{
            postDispatch({type:ADD_POST,payload:res.data})
        })
    },[]);

    const handleLikes = (likes) => state && likes.includes(state._id);

    const handleUnlikes = (unlikes) => state && unlikes.includes(state._id);

    const like = (id) => {
        fetch(`${localURL}/like/${id}`,{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
            .then(resu=>{
                axios.get(`${localURL}/all-posts`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                }).then(res=>{
                    postDispatch({type:ADD_POST,payload:res.data})
                })
            })
            .catch(err=>{
                console.log(err)
        })
    }

    const unlike = (id) => {
        fetch(`${localURL}/unlike/${id}`,{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
            .then(resu=>{
                axios.get(`${localURL}/all-posts`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                }).then(res=>{
                    postDispatch({type:ADD_POST,payload:res.data})
                })
            })
            .catch(err=>{
                console.log(err)
        })
    }

    return(
        <div>
            <MenuExampleSecondary ai={''} />
            {postState && state && postState.length>0 ? 
                <Segment basic textAlign='center'><h2>All Posts !</h2></Segment>
                :
                <Segment basic textAlign='center'><h2>No Posts !</h2></Segment>
            }
            {state && postState ? 
                <Segment basic>  
                {postState.map(item=>(
                    <Card 
                    key={item._id}
                    style={{width:"70%"}}
                    centered 
                    image={item.photo}
                    header={item.title}
                    meta={item.postedBy.name}
                    description={item.description}
                    extra={
                            <div>
                                {handleLikes(item.likes) ? 
                                    <>
                                        <Icon name='like' color='red' />
                                        {item.likes.length}
                                    </>
                                    :
                                    <>
                                        <Icon name='like' onClick={()=>like(item._id)} />
                                        {item.likes.length}
                                    </>
                                }
                                {handleUnlikes(item.unlikes) ? 
                                    <>
                                        <Icon name='thumbs down' color='red' style={{marginLeft:"20px"}} />
                                        {item.unlikes.length}
                                    </>
                                    :
                                    <>
                                        <Icon name='thumbs down' onClick={()=>unlike(item._id)} style={{marginLeft:"20px"}} />
                                        {item.unlikes.length}
                                    </>
                                }
                            </div>   
                          }
                    />
                ))} 
                </Segment>
                :
                <Segment basic loading style={{height:"600px"}}></Segment>
            }
        </div>
    )
}

export default Home;