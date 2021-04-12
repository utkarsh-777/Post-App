import React, { useState } from "react";
import MenuExampleSecondary from "./menu";
import {
    Form,
    Button,
    Container
} from "semantic-ui-react";
import {localURL} from "../serverUrl";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router";


const Create = () => {

    const [title,setTitle] = useState();
    const [description,setDescription] = useState();
    const [photo,setPhoto] = useState();

    const [loading,setLoading] = useState(false);

    const history = useHistory();

    const handleSubmit = () => {
        if(!photo || !description || !title) {
            return toast('Fill all details!',{type:'warning'})
        }
        setLoading(true);
        fetch(`${localURL}/createpost`,{
            method:'post',
            headers:{
                Authorization:localStorage.getItem('token'),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({title,description,photo})
        }).then(res=>res.json()).then(resp=>{
            if(resp.error){
                return toast(resp.error,{type:'error'})
            }
            setLoading(false);
            toast('Posted!',{type:'dark'})
            return history.push('/profile')
        })
    }
    return(
        <div>
            <MenuExampleSecondary ai={'create-post'} />
                <Container >
                <ToastContainer />
                <h2>Create Post</h2>
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
                        <input onChange={(e)=>setPhoto(e.target.value)} value={photo} placeholder='Enter the photo URL' />
                    </Form.Field>
                    {loading ? 
                        <Button loading type='submit'>Submit</Button>
                        :
                        <Button type='submit' onClick={()=>{handleSubmit()}}>Submit</Button>
                    }
                    
                    </Form>
                </Container>
        </div>
    )
}

export default Create;