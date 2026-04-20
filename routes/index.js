const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const db=require('../utils/db');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    }
});
const upload=multer({storage:storage});

router.get('/',(req,res)=>{
    let posts=db.getPost();
    const{search,category}=req.query;

    // filter by category
    if(category){
        posts=posts.filter(post=>post.category===category);
    }
    // filter by search term
    if(search){
        const term=search.toLowerCase();
        posts=posts.filter(post=>post.title.toLowerCase().includes(term)||(post.content && post.content.toLowerCase().includes(term)));
    }
    res.render('index',{title:'Blogging Platform',posts:posts,searchQuery:search||'',categoryFilter:category||''});
});

router.post('/',upload.single('image'),(req,res)=>{
    const newPost={
        title:req.body.title,
        content:req.body.content,
        category:req.body.category,
        imageUrl:req.file?'/uploads/'+req.file.filename:null
    };
    db.savePost(newPost);
    res.redirect('/');
});

router.post('/delete/:id',(req,res)=>{
    if(!req.session.user){
        return res.send('You must be logged in to delete a post');
    }
    const postId=req.params.id;
    db.deletePost(postId);
    res.redirect('/');
});


module.exports=router;