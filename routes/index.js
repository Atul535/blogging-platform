const express=require('express');
const router=express.Router();

const db=require('../utils/db');

router.get('/',(req,res)=>{
    const posts=db.getPost();
    res.render('index',{title:'Blogging Platform',posts:posts});
});


module.exports=router;