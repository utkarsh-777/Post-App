import React, { useEffect, useState } from "react";
import MenuExampleSecondary from "./menu";

import {
    Form,
    Button,
    Segment,
    Container,
    Icon,
    Header,
    Modal
} from "semantic-ui-react";
import axios from "axios";
import {localURL} from "../serverUrl";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";

const queryString = require('query-string');

const Update = ({location}) => {
    const parsed = queryString.parse(location.search);
    const history = useHistory();

    const [title,setTitle] = useState();
    const [description,setDescription] = useState();
    const [photo,setPhoto] = useState();

    const [loading,setLoading] = useState(false);
    const [deleteLoading,setDeleteLoading] = useState(false);

    const [open,setOpen] = useState(false);

    useEffect(()=>{
        if(parsed){
            axios.get(`${localURL}/get-post/${parsed.id}`,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            }).then(res=>{
                setTitle(res.data.title);
                setDescription(res.data.description);
                setPhoto(res.data.photo);
            }).catch(err=>console.log(err));
        }
    },[parsed]);

    const handleSubmit = () => {
        if(!photo || !description || !title) {
            return toast('Fill all details!',{type:'warning'})
        }
        setLoading(true);
        fetch(`${localURL}/update-post/${parsed.id}`,{
            method:'put',
            headers:{
                Authorization:localStorage.getItem('token'),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                title,
                description,
                photo
            })
        }).then(res=>res.json()).then(resu=>{
            setLoading(false);
            return toast('Updated Successfully!',{type:'success'})
        }).catch(err=>console.log(err))
    }

    const handleDelete = () => {
        setDeleteLoading(true);
        fetch(`${localURL}/deletepost/${parsed.id}`,{
            method:'delete',
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json()).then(resp=>{
            setDeleteLoading(false);
            history.push('/profile')
        })
    }

    return(
        <div>
            <MenuExampleSecondary />
            {title && description && photo ? 
                <Container >
                <ToastContainer />
                <h2>Update Post <a href="#"><Icon onClick={()=>setOpen(true)} name='trash alternate outline' color='red' style={{float:'right'}} /></a></h2>
                    <Form>
                    <Form.Field>
                        <label>Title</label>
                        <input onChange={(e)=>setTitle(e.target.value)} value={title} placeholder='Enter the title' />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input onChange={(e)=>setDescription(e.target.value)} value={description} placeholder='Enter the description' />
                    </Form.Field>
                    <Form.Field>
                        <label>Photo</label>
                        <input onChange={(e)=>setPhoto(e.target.value)} value={photo} placeholder='Enter the photo' />
                    </Form.Field>
                    {loading ? 
                        <Button loading type='submit'>Save</Button>
                        :
                        <Button type='submit' inverted color='green' onClick={()=>{handleSubmit()}}>Save</Button>
                    }
                    
                    </Form>
                    <Modal
                        basic
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        size='small'
                    >
                            <Header icon>
                            <Icon name='trash alternate outline' />
                            Delete Post {title} !
                            </Header>
                            <Modal.Content>
                            <p>
                                Are you sure you want to delete post {title} ! Once deleted cannot be undone..
                            </p>
                            </Modal.Content>
                            <Modal.Actions>
                            <Button basic color='red' inverted onClick={() => setOpen(false)}>
                                <Icon name='remove' /> No
                            </Button>
                            {deleteLoading ? 
                                <Button color='green' loading inverted>
                                    <Icon name='checkmark' /> Yes
                                </Button>
                                :
                                <Button color='green' inverted onClick={() => handleDelete()}>
                                    <Icon name='checkmark' /> Yes
                                </Button>
                            }
                            </Modal.Actions>
                    </Modal>
                </Container>
                :
                <Segment basic loading style={{height:"600px"}}></Segment>
            }
        </div>
    )
}

export default Update;