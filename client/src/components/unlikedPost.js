import React, { useContext, useEffect, useState } from "react";
import { Segment } from "semantic-ui-react";
import MenuExampleSecondary from "./menu";
import { Card, Icon } from 'semantic-ui-react';
import axios from "axios";

import {localURL} from "../serverUrl";
import { PostContext } from "../context/context";
import { ADD_POST, REMOVE_POST } from "../context/action.types";

const UnlikedPost = () => {
    const {postState,postDispatch} = useContext(PostContext);

    useEffect(()=>{
        postDispatch({type:REMOVE_POST})
        axios.get(`${localURL}/unliked-posts`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>{
            postDispatch({type:ADD_POST,payload:res.data})
        })
    },[]);

    return(
        <div>
            <MenuExampleSecondary ai={'unliked-post'} />
            { postState ? 
                <Segment basic>  
                {postState && postState.length>0 ? 
                    <Segment basic textAlign='center'><h2>Your Unliked Posts !</h2></Segment>
                    :
                    <Segment basic textAlign='center'><h2>No Posts !</h2></Segment>
                }
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
                                <Icon name='thumbs down' color='red' />
                                {item.unlikes.length}
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

export default UnlikedPost;