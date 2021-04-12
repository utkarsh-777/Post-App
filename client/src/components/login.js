import React, { useContext, useState } from "react";
import { 
    Container,
    Form,
    Checkbox,
    Button
} from "semantic-ui-react";

import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { localURL } from "../serverUrl";
import { useHistory } from "react-router";
import { UserContext } from "../context/context";
import { ADD_USER } from "../context/action.types";

import MenuExampleSecondary from "./menu";

const Login = () => {

    const {dispatch} = useContext(UserContext);

    const [checked,setChecked] = useState(false);
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();

    const [loading,setLoading] = useState(false);

    const history = useHistory();

    const formCheck = () => {
        if (!email || !password) {
            return toast("Fill All Details!",{type:'dark'})
        }
        setChecked(!checked)
    }    

    const handleSubmit = () => {
        if (!email || !password) {
            return toast("Fill All Details!",{type:'dark'})
        }
        setLoading(true);
        axios.post(`${localURL}/login`,{
            email,
            password
        }).then(res=>{
            setLoading(false);
            if(res.data.error){
                return toast(res.data.error,{type:'error'});
            }
            localStorage.setItem('token',res.data.token)
            dispatch({type:ADD_USER,payload:res.data.user})
            history.push('/')
        })
    }

    return(
        <div>
        <MenuExampleSecondary ai='login' />
        <Container>
            <ToastContainer />
            <h1>Login</h1>
            <Form>
                <Form.Field>
                <label>Email</label>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Your Email' />
                </Form.Field>
                <Form.Field>
                <label>Password</label>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder='Enter Your Password' />
                </Form.Field>
                <Form.Field>
                <Checkbox checked={checked} onChange={()=>formCheck()} label='I agree to the Terms and Conditions' />
                </Form.Field>
                {checked ? 
                    <div>
                        {loading ? 
                            <Button loading type='submit' onClick={()=>handleSubmit()}>Submit</Button>
                            :
                            <Button type='submit' onClick={()=>handleSubmit()}>Submit</Button>
                        }
                    </div>
                    :
                    <Button disabled type='submit'>Submit</Button>
                }
            </Form>
        </Container>
        </div>
    )
}

export default Login;