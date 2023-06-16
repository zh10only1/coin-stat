const express = require('express');
const authController = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const router = express.Router();


// user

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

// logout 
router.post('/logout', auth, authController.logout);

// refresh
router.get('/refresh', authController.refresh);

// blog CRUD

// create blog
router.post('/create', auth, blogController.create);

// get all blogs
router.get('/blog/all', auth, blogController.getAll);

// get blog by id
router.get('/blog/:id', auth, blogController.getById);

// update blog
router.put('/blog', auth, blogController.update);

// delete blog
router.delete('/blog/:id', auth, blogController.delete);

// comment
// create comment
router.post('/comment', auth, commentController.create);
// read comments
router.get('/comment/:blog_id', auth, commentController.getAllByBlogId);


module.exports = router;