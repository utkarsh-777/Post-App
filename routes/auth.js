const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {SECRET} = require("../keys")

const requireLogin = require('../middleware/requireLogin');

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(401).json({
            error:"Provide all credentials!"
        });
    }

    User.findOne({email:email})
        .then(user => {
            if(user) {
                return res.status(422).json({
                    error:'You are already registered kindly login!'
                })
            }
            bcrypt.hash(password,12)
                .then(hashedpassword=>{
                    const newuser = new User({
                        name,
                        email,
                        password:hashedpassword
                    })
                    newuser.save()
                        .then(
                            res.json({
                                name,
                                email
                            }) 
                        )
                })
        })
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                return res.json({
                    error:"Email not registered signup first!"
                })
            }
            bcrypt.compare(password,user.password)
                .then(match=>{
                    if(match){
                        const token = jwt.sign({email:user.email,name:user.name},SECRET);
                        const {_id,name,email,followers,following} = user;
                        return res.json({
                            user:{
                            _id,
                            name,
                            email,
                            followers,
                            following
                            },
                            token:"Bearer "+token
                        })
                    }
                    else{
                        return res.status(422).json({
                            error:"Invalid username or password!"
                        })
                    }
                })
                .catch(err=>console.log(err))
        }).catch(err=>console.log(err))
});

router.get("/user",requireLogin,(req,res)=>{
    const {_id,name,email,followers,following} = req.user;
    return res.json({user:{_id,name,email,followers,following}})
});

module.exports = router;