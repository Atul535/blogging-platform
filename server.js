const express= require('express');
const session=require('express-session');
const app=express();
const port=3000;

const indexRouter=require('./routes/index');
const authRouter=require('./routes/auth/auth');

app.use('/',indexRouter);
app.use('/auth',authRouter);

app.set('view engine','ejs');
app.use(session({
    secret:'my_secret_key',
    resave:false,
    saveUninitialized:false
}));



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);  
});