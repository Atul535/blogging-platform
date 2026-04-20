const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new FileStore({
        path: './sessions',   // sessions saved here as files
        ttl: 86400,           // session lasts 24 hours
        retries: 0
    }),
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000  // 24 hours in milliseconds
    }
}));

// Middleware to pass user data to all views
app.use((req, res, next) => {
    const sessionUser = req.session.user;
    res.locals.title = 'Blogging Platform';

    if (!sessionUser) {
        res.locals.user = null;
        return next();
    } 
    
    if (typeof sessionUser === 'string') {
        // old session format (just email) — destroy it
        return req.session.destroy((err) => {
            if (err) console.error('Session destroy error:', err);
            res.locals.user = null;
            next();
        });
    } 

    res.locals.user = sessionUser.name.split(' ')[0]; // first name
    next();
});

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth/auth');

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});