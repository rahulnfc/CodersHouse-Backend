const router = require('express').Router();
const postController = require('../controllers/post');
const { upload } = require('../middlewares/fileUpload');

// @route POST /posts/textPost
// @desc Create a text post
// @access Private
router.post('/textPost', postController.CreateTextPost);

// @route Post /posts/imagePost
// @desc Create an image post
// @access Private
router.post('/imagePost', upload.array('image',5), postController.CreateImagePost);

// @route Get /posts/allposts
// @desc Get all posts of a user
// @access Private
router.get('/allposts', postController.GetAllPosts);

// @route Post /posts/like
// @desc Like a post
// @access Private
router.post('/like', postController.LikePost);

// @route Post /posts/unlike
// @desc Unlike a post
// @access Private
router.post('/unlike', postController.UnlikePost);

module.exports = router;