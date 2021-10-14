const router = require('express').Router();
const userController = require('../controllers/user');
const { upload } = require('../middlewares/fileUpload');
const {checkLoggedIn } = require('../middlewares/userJWTAuth');

// @route   GET /user/me
// @desc    Get current user
// @access  Private
router.get('/me', checkLoggedIn, userController.GetMe);

// @route   POST /user/follow
// @desc    Follow user
// @access  Private
router.post('/follow', userController.Follow);

// @route   Put /user/follow:id
// @desc    Unfollow user
// @access  Private
router.put('/follow:id', userController.Unfollow);

// @route   Get /user/following
// @desc    Get following users
// @access  Private
router.get('/following', userController.Following);

// @route   Get /user/followers
// @desc    Get followers users
// @access  Private
router.get('/followers', userController.Followers);

// @route   Get /user/connections
// @desc    Get connections users
// @access  Private
router.get('/connections', userController.Connections);

// @route   Get /user/peopleyoumayknow
// @desc    Get people you may know
// @access  Private
router.get('/peopleyoumayknow', userController.PeopleYouMayKnow);

// @route   Get /user/:id
// @desc    Get user by id
// @access  Private
router.get('/:id', userController.GetUser);

// @route   Post /user/uploadProfileImage
// @desc    Upload profile image
// @access  Private
router.post('/uploadProfileImage',upload.single('image'), userController.UploadProfileImage);

// @route Delete /user/uploadProfileImage/:id
// @desc    Delete profile image
// @access  Private
router.delete('/uploadProfileImage/:id', userController.DeleteProfileImage);

// @route   Post /user/uploadCoverImage
// @desc    Upload cover image
// @access  Private
router.post('/uploadCoverImage', upload.single('image'), userController.UploadCoverImage);

//@routes Delete /user/uploadCoverImage/:id
// @desc    Delete cover image
// @access  Private
router.delete('/uploadCoverImage/:id', userController.DeleteCoverImage);

// @route   Put /user/updateProfile
// @desc    Update profile
// @access  Private
router.put('/updateProfile', userController.UpdateProfile);

// @route   Post /user/Work
// @desc    Add work
// @access  Private
router.post('/Work', userController.AddWork);

// @route   Delete /user/Work/:id
// @desc    Remove work
// @access  Private
router.delete('/Work:id', userController.RemoveWork);

// @route   Put /user/Work/:id
// @desc    Update work
// @access  Private
router.put('/Work/:id', userController.UpdateWork);

// @route   Post /user/Education
// @desc    Add education
// @access  Private
router.post('/Education', userController.AddEducation);

// @route  Delete /user/Education/:id
// @desc    Remove education
// @access  Private
router.delete('/Education/:id', userController.RemoveEducation);

// @route   Put /user/Education/:id
// @desc    Update education
// @access  Private
router.get('/Education/:id', userController.UpdateEducation);

module.exports = router;