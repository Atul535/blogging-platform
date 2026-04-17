const express=require('express');
const router=express.Router();
const db=require('../../utils/db');

// Register routes

//1. Show registration form
router.get('/register',(req,res)=>{
    res.render('auth/register',{title:'Register'});
});

//2. Handle registration form submission
router.post('/register',(req,res)=>{
    const{username,password}=req.body;
    const users=db.getUsers();
    const userExists= users.find(user=>user.username===username);

    if(userExists){
        return res.send('user already exists <a href="/auth/register">Try again!</a>');
    }
    db.saveUser({username,password});
    res.redirect('/auth/login');

});

// Login routes

//3. Show login form
router.get('/login',(req,res)=>{
    res.render('auth/login',{title:'Login'});
});

router.post('/login',(req,res)=>{
    const{username,password}=req.body;
    const users=db.getUsers();
    const user=users.find(user=>user.username===username && user.password===password);
    if(user){
        req.session.user=user.username;
        res.redirect('/');
    }
    else{
        res.send('Invalid credentials! <a href="/auth/login">Try again!</a>')
    }
});

// Logout Route
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
});

module.exports=router;



