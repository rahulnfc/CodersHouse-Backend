const router = require('express').Router();
const authController = require('../controllers/auth');

// @route   POST auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.PostLogin);

// @route   POST auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.PostRegister);

// @route   GET auth/google
// @desc    Google OAuth
// @access  Public
router.get('/google', authController.GetGoogle);

// @route   GET auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', authController.GetGoogleCallback);

// @route   GET auth/googlewithpassword
// @desc    Google OAuth with password
// @access  Public
router.post('/googlewithpassword', authController.PostGoogleWithPassword);

// @route   GET auth/logout
// @desc    Logout user
// @access  Private
router.get('/logout', authController.GetLogout);

// @route   POST auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post('/forgotpassword', authController.PostForgotPassword);

module.exports = router;