import React, { useContext, useEffect, useState } from "react";
import {Grid,Icon, Segment,Card} from "semantic-ui-react";
import { UserContext } from "../context/context";
import MenuExampleSecondary from "./menu";
import "./components.css"
import axios from "axios";

import {localURL} from "../serverUrl";
import { useHistory } from "react-router";

import "./components.css"

const Profile = () => {
    const {state} = useContext(UserContext);
    const [posts,setPosts] = useState([]);
    const history = useHistory();

    useEffect(()=>{
        axios.get(`${localURL}/myposts`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(res=>{
                setPosts(res.data.myposts)
                console.log(res.data)
            })
            .catch(err=>console.log(err))
    },[]);

    const handleUpdate = (id) => {
        history.push(`/update?id=${id}`)
    }

    return(
    <div>
        <MenuExampleSecondary ai='profile' />
        {state && posts ? 
            <div>
                <Grid style={{marginBottom:'20px'}} divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column id='profile' width={8}>
                            <Icon name="user circle outline" size="massive" />
                            <h2>{state.name}<br/><span style={{color:'GrayText'}}>{state.email}</span></h2>
                        </Grid.Column>
                        <Grid.Column width={8}>
                        <div style={{marginTop:"7%"}}>
                            <h3>Posts</h3><br/>
                            {posts.length}
                        </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <hr/>
                {posts && !posts.length>0 && <Segment basic textAlign='center'><h2>No Posts !</h2></Segment>}
                <Grid style={{marginTop:"20px"}}>
                    <Grid.Row>
                    {posts.length>0 && posts.map(item=>(
                        <Grid.Column width={8}>
                                <Card 
                                    href=''
                                    onClick={()=>handleUpdate(item._id)}
                                    key={item._id}
                                    style={{width:"70%"}}
                                    centered 
                                    image='/images/avatar/large/elliot.jpg'
                                    header={item.title}
                                    meta={item.postedBy.name}
                                    description={item.description}
                                    extra={
                                        <div>
                                            <Icon name='like' />
                                            {item.likes.length} 
                                            <Icon name='thumbs down' style={{marginLeft:"20px"}} />
                                            {item.unlikes.length}
                                        </div>
                                    }
                                />
                        </Grid.Column>
                        ))}
                    </Grid.Row>
                </Grid>
            </div>
            :
            <Segment basic loading style={{height:"600px"}}></Segment>
        }
    </div>
    )
}

export default Profile;