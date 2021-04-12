const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const User = require("../models/User");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    unlikes:[{
        type:ObjectId,
        ref:"User"
    }],
    comments:[{
        comment:{
            type:String
        },
        postedBy:{
            type:ObjectId,
            ref:"User"
        }
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})

module.exports = mongoose.model("Post",postSchema);
