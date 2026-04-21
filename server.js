// Import required packages
const express = require('express');                  // Express framework
const session = require('express-session');          // Session middleware
const FileStore = require('session-file-store')(session); // Store sessions in files
const expressLayouts = require('express-ejs-layouts');    // Layout support for EJS
const dotenv = require('dotenv');
dotenv.config();    
// Create Express app
const app = express();
const port = process.env.PORT || 3000; // Server will run on port 3000


// ---------------------- STATIC FILES ----------------------

// Serve uploaded files (like images) from "uploads" folder
// Example: http://localhost:3000/uploads/image.png
app.use('/uploads', express.static('uploads'));

// Serve all static files (CSS, JS, images) from "public" folder
// Example: http://localhost:3000/style.css
app.use(express.static('public'));


// ---------------------- VIEW ENGINE SETUP ----------------------

// Enable EJS layouts (common header/footer)
app.use(expressLayouts);

// Set EJS as templating engine
app.set('view engine', 'ejs');


// ---------------------- BODY PARSING ----------------------

// Parse incoming JSON data (for APIs)
app.use(express.json());

// Parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));


// ---------------------- SESSION CONFIGURATION ----------------------

app.use(session({
    // Store session data in files instead of memory
    store: new FileStore({
        path: './sessions',   // Folder where session files will be saved
        ttl: 86400,           // Time-to-live (in seconds) → 24 hours
        retries: 0            // Retry attempts if session save fails
    }),
    secret: process.env.SESSION_SECRET,  // Secret key used to sign session ID cookies
    resave: false,            // Don't save session if nothing changed
    saveUninitialized: false, // Don't create session until something stored

    cookie: {
        maxAge: 24 * 60 * 60 * 1000  // Cookie expires in 24 hours (ms)
    }
}));


// ---------------------- GLOBAL MIDDLEWARE ----------------------

// This middleware runs on EVERY request
// Purpose: Make user data available in all EJS views
app.use((req, res, next) => {

    const sessionUser = req.session.user; // Get user from session

    if (!sessionUser) {
        // If no user logged in → set user as null
        res.locals.user = null;

    } else if (typeof sessionUser === 'string') {
        // If session data is corrupted (string instead of object)
        // destroy session to prevent errors
        req.session.destroy();
        res.locals.user = null;

    } else {
        // If user exists → extract first name only
        // Example: "Atul Mishra" → "Atul"
        res.locals.user = sessionUser.name.split(' ')[0];
    }

    // Set default title for all pages
    res.locals.title = 'Blogging Platform';

    next(); // Move to next middleware/route
});


// ---------------------- ROUTES ----------------------

// Import route files
const indexRouter = require('./routes/index');        // Main routes
const authRouter = require('./routes/auth/auth');     // Authentication routes

// Use routes
app.use('/', indexRouter);        // Home routes
app.use('/auth', authRouter);     // Auth routes (login/register/logout)


// ---------------------- START SERVER ----------------------

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});