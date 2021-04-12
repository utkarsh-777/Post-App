const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const router = express.Router();
const Post = require("../models/Post");

router.post('/createpost',requireLogin,(req,res)=>{
    console.log(req.body)
    const {title,description,photo} = req.body;
    if(!title || !description || !photo){
        return res.json({
            error:"Enter all fields!"
        })
    }
    const newPost = new Post({
        title,
        description,
        photo,
        postedBy:req.user
    });
    newPost.save()
        .then(post=>{
            return res.json(post)
        })
        .catch(err=>{
            console.log(err)
        })
});

router.get('/get-post/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
        .then(post=>{
            if(!post){
                return res.json({error:'Post not found!'})
            }
            return res.json(post);
        })
});

router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name")
        .then(posts=>{
            if(!posts){
                return res.status(421).json({
                    error:'No posts!'
                })
            }
            return res.json({
                myposts:posts
            })
        })
});

router.get('/all-posts',requireLogin,(req,res)=>{
    Post.find()
        .populate("postedBy","_id name")
        .then(posts=>{
            if(!posts){
                return res.json({error:"Posts not found!"})
            }
            return res.json(posts)
        })
})

router.put("/update-post/:postId",requireLogin,(req,res)=>{
    if(!req.body.title || !req.body.description || !req.body.photo){
        return res.json({error:"Update unsucessful!"})
    }
    Post.findByIdAndUpdate({_id:req.params.postId},{
        $set:{
            title:req.body.title,
            description:req.body.description,
            photo:req.body.photo
        }
    },{new:true}).exec((err,result)=>{
        if(err) throw err;
        return res.json(result)
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findById({_id:req.params.postId})
        .then(post=>{
            if(!post){
                return res.status(404).json({
                    error:"Not found!"
                })
            }
            if(post.postedBy._id.toString()===req.user._id.toString()){
                post.remove()
                    .then(result=>{
                        return res.json(result)
                    })
            }
            else{
                return res.json({
                    error:"You are not Authorized!"
                })
            }
        })
});

router.put('/like/:postId',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.params.postId},{
        $pull:{unlikes:req.user._id},
    },{
        new:true
    }).exec((err,result)=>{
        if(err) throw err;
        //console.log(result);
    });

    Post.findByIdAndUpdate({_id:req.params.postId},{
        $push:{likes:req.user._id},
    },{
        new:true
    })
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(421).json(err)
            }
            else{
                return res.json(result)
            }
        })
});

router.put('/unlike/:postId',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.params.postId},{
        $push:{unlikes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err) throw err;
        //console.log(result)
    });

    Post.findByIdAndUpdate({_id:req.params.postId},{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(421).json({
                error:err
            })
        }
        return res.json(result)
    })
});

router.put("/comment/:postId",requireLogin,(req,res)=>{
    const comment = req.body.comment;
    if(!comment){
        return res.status(421).json({
            error:"Enter the comment!"
        })
    }
    Post.findByIdAndUpdate({_id:req.params.postId},{
        $push:{comments:{comment,postedBy:req.user._id}}
    },{new:true})
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(421).json({
                    error:err
                })
            }
            return res.json(result)
        })
});

router.delete("/deletecomment/:postId",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.params.postId},{
        $pull:{comments:{comment:req.body.comment}}
    },{new:true})
        .populate("postedBy","_id name")
        .populate("comments.postedBy","_id name")
        .exec((err,result)=>{
            if(err){
                return res.status(421).json({
                    error:err
                })
            }
            return res.json(result)
        })
});

router.get('/liked-posts',requireLogin,(req,res)=>{
    Post.find({likes:req.user._id})
        .then(posts=>{
            if(!posts){
                return res.json({msg:"No posts!"})
            }
            return res.json(posts)
        }).catch(err=>console.log(err))
});

router.get('/unliked-posts',requireLogin,(req,res)=>{
    Post.find({unlikes:req.user._id})
        .then(posts=>{
            if(!posts){
                return res.json({msg:"No posts!"})
            }
            return res.json(posts)
        })
        .catch(err=>console.log(err))
});

router.post('/search-post',requireLogin,(req,res)=>{
    const pattern = new RegExp("^"+req.body.postTitle)
    Post.find({title:{$regex:pattern}})
        .then(resu=>res.json(resu))
        .catch(err=>console.log(err))
});

module.exports = router;