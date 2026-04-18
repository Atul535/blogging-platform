const express= require('express');
const session=require('express-session');
const expressLayouts=require('express-ejs-layouts');
const app=express();
const port=3000;

app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

// ---> MOVE THESE TWO LINES ABOVE YOUR ROUTES <---
app.use(expressLayouts);
app.set('view engine','ejs');

app.use(session({
    secret:'my_secret_key',
    resave:false,
    saveUninitialized:false
}));

const indexRouter=require('./routes/index');
const authRouter=require('./routes/auth/auth');

app.use('/',indexRouter);
app.use('/auth',authRouter);



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);  
});
