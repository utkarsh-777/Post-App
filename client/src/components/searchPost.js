import React, { useState } from "react";
import { Form, Input, Segment } from "semantic-ui-react";
import MenuExampleSecondary from "./menu";
import { Card, Icon } from 'semantic-ui-react';

import {localURL} from "../serverUrl";

const Search = () => {
    const [posts,setPosts] = useState([]);
    const [loading,setLoading] = useState(false);

    const handleSearch = (title) => {
        setLoading(true);
        fetch(`${localURL}/search-post`,{
            method:'post',
            headers:{
                Authorization:localStorage.getItem('token'),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                postTitle:title
            })
        }).then(res=>res.json()).then(resp=>{
            setPosts(resp);
            setLoading(false);
        })
        .catch(err=>console.log(err))
    }

    return(
        <div>
            <MenuExampleSecondary />
            <Segment basic textAlign='center'>
            <Form>
                <Form.Field>
            {loading ? 
                <Input loading placeholder='search...' onChange={(e)=>handleSearch(e.target.value)} />
                :
                <Input icon='search' placeholder='search...' onChange={(e)=>handleSearch(e.target.value)} />
            }
                </Form.Field>
            </Form>
            </Segment>
            { posts ? 
                <Segment basic>  
     
                {posts.map(item=>(
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
                                <Icon name="like" color='red' />
                                {item.likes.length}
                                <Icon name='thumbs down' style={{marginLeft:"20px"}} color='red' />
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

export default Search;