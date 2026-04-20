// Import required modules
const express = require('express');
const router = express.Router();        // Create router instance
const multer = require('multer');       // For file uploads (images)
const path = require('path');           // To handle file paths
const db = require('../utils/db');      // Custom DB utility (JSON-based)


// ---------------------- MULTER CONFIGURATION ----------------------

// Define storage settings for uploaded files
const storage = multer.diskStorage({

    // Where to store uploaded files
    destination: (req, file, cb) => {
        cb(null, 'uploads/');   // Save files inside "uploads" folder
    },

    // How to name uploaded files
    filename: (req, file, cb) => {
        // Example: 1713612345678.png
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create multer instance with above storage config
const upload = multer({ storage: storage });


// ---------------------- GET ALL POSTS ----------------------

// Route: GET /
// Purpose: Display all blog posts with optional filtering
router.get('/', (req, res) => {

    let posts = db.getPost();   // Fetch all posts from database

    const { search, category } = req.query; // Get query params from URL
    // Example: /?search=node&category=tech

    
    // ---------------- FILTER BY CATEGORY ----------------
    if (category) {
        posts = posts.filter(post => post.category === category);
    }

    
    // ---------------- FILTER BY SEARCH ----------------
    if (search) {
        const term = search.toLowerCase();

        posts = posts.filter(post =>
            post.title.toLowerCase().includes(term) || 
            (post.content && post.content.toLowerCase().includes(term))
        );
    }

    
    // Render index.ejs and pass data
    res.render('index', {
        title: 'Blogging Platform',
        posts: posts,
        searchQuery: search || '',        // Maintain search input value
        categoryFilter: category || ''    // Maintain selected category
    });
});


// ---------------------- CREATE NEW POST ----------------------

// Route: POST /
// Middleware: upload.single('image')
// Purpose: Handle form submission with image upload
router.post('/', upload.single('image'), (req, res) => {

    // Create new post object
    const newPost = {
        title: req.body.title,           // From form input
        content: req.body.content,       // From form input
        category: req.body.category,     // From form input

        // If image uploaded → save path
        // Else → null
        imageUrl: req.file ? '/uploads/' + req.file.filename : null
    };

    // Save post to database (JSON file)
    db.savePost(newPost);

    // Redirect back to homepage
    res.redirect('/');
});


// ---------------------- DELETE POST ----------------------

// Route: POST /delete/:id
// Purpose: Delete a post by ID
router.post('/delete/:id', (req, res) => {

    // Check if user is logged in
    if (!req.session.user) {
        return res.send('You must be logged in to delete a post');
    }

    const postId = req.params.id; // Get post ID from URL

    // Delete post from database
    db.deletePost(postId);

    // Redirect back to homepage
    res.redirect('/');
});


// Export router so it can be used in app.js
module.exports = router;