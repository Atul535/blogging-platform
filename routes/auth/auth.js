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
    const{name,email,password,confirmPassword}=req.body;
    const users=db.getUser();
    const userExists= users.find(user=>user.email===email);

    if(userExists){
        return res.send('user already exists <a href="/auth/register">Try again!</a>');
    }
    if(password!==confirmPassword){
        return res.send('password does not match <a href="/auth/register">Try again!</a>');
    }
    if(password.length<6){
        return res.send('password must be at least 6 characters long <a href="/auth/register">Try again!</a>');
    }
    db.saveUser({name,email,password});
    res.redirect('/auth/login');

});

// Login routes

//3. Show login form
router.get('/login',(req,res)=>{
    res.render('auth/login',{title:'Login'});
});

router.post('/login',(req,res)=>{
    const{email,password}=req.body;
    const users=db.getUser();
    const user=users.find(user=>user.email===email && user.password===password);
    if(user){
        req.session.user={name:user.name,email:user.email};
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.send('Error saving session');
            }
            res.redirect('/');
        });
    }
    else{
        res.send('Invalid credentials! <a href="/auth/login">Try again!</a>')
    }
});

// Logout Route
router.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.redirect('/');
    });
});

module.exports=router;



