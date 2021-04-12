import React, { useState } from "react";
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
import MenuExampleSecondary from "./menu";

const Signup = () => {

    const [checked,setChecked] = useState(false);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();

    const [loading,setLoading] = useState(false);

    const history = useHistory();

    const formCheck = () => {
        if (!name || !email || !password) {
            return toast("Fill All Details!",{type:'dark'})
        }
        setChecked(!checked)
    }    

    const handleSubmit = () => {
        if (!name || !email || !password) {
            return toast("Fill All Details!",{type:'dark'})
        }
        setLoading(true);
        axios.post(`${localURL}/signup`,{
            name,
            email,
            password
        }).then(res=>{
            setLoading(false);
            if(res.data.error){
                return toast(res.data.error,{type:'error'});
            }
            history.push('/login')
        })
    }

    return(
        <div>
        <MenuExampleSecondary ai={'signup'} />
        <Container>
            <ToastContainer />
            <h1>Signup</h1>
            <Form>
                <Form.Field>
                <label>Name</label>
                <input type="text" onChange={(e)=>setName(e.target.value)} placeholder='Enter Your Name' />
                </Form.Field>
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

export default Signup;