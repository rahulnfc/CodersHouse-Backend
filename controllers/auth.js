const authHelper = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const nodemailer = require('nodemailer');
const maxAge = 60 * 60 * 1; // 1 hour
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};


module.exports = {
    PostLogin: async (req, res) => {
        try {
            const Login = await authHelper.Login(req.body);
            if (Login.user) {
                const user = {
                    id: Login.data._id,
                    username: Login.data.username,
                    role: Login.data.role
                }
                const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: maxAge });
                const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_SECRET, { expiresIn: maxAge * 24 }); // 1 day
                res.status(200).json({ userId: user.id, token: token, refreshToken: refreshToken });
            } else if (Login.emailError) {
                res.status(403).json({emailError : true});
            } else if (Login.passwordError) {
                res.status(403).json({passwordError : true});
            } else if (Login.userBlocked) {
                res.status(403).json({userBlocked : true});
            }
        } catch (error) {
            res.status(500).json({message:'Something went wrong, please try again later'});
        }
    },
    PostRegister: async (req, res) => {
        try {
            const Register = await authHelper.Register(req.body);
            if (Register.user) {
                res.status(200).json({ user: Register.data });
            } else if (Register.emailError) {
                res.status(403).json({emailError:true});
            } else if (Register.phonenumberError) {
                res.status(403).json({phonenumberError:true});
            }
        } catch (error) {
            res.status(500).json({messge: 'Something went wrong, please try again later'});
        }
    },
    GetGoogle: passport.authenticate('google', { scope: ['profile', 'email'] }),
    GetGoogleCallback: async (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/register'); }
            res.status(200).json('successfully registered with google account');
        })(req, res, next);
    },
    PostGoogleWithPassword: async (req, res) => {
        const GoogleWithPassword = await authHelper.GoogleWithPassword(req.body);
        if (GoogleWithPassword.user) {
            const token = createToken(GoogleWithPassword.user._id);
            res.cookie('userjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ user: GoogleWithPassword.user._id, token: token });
        } else if (GoogleWithPassword.googleIdError) {
            res.status(403).json('you are not registered with google account');
        }
    },
    GetLogout: (req, res) => {
        res.clearCookie('userjwt');
        res.status(200).json('successfully logged out');
    },
    PostForgotPassword: async (req, res) => {
        const isEmailValid = await authHelper.isEmailValid(req.body.email);
        if (isEmailValid) {
            const transporter = await nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASSWORD
                },
                authMethod: 'XOAUTH2'
            });
            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,
                to: req.body.email,
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + req.body.email + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json('Something went wrong, please try again later');
                } else {
                    res.status(200).json('An e-mail has been sent to ' + req.body.email + ' with further instructions.');
                }
            });
        } else {
            res.status(403).json('email address not found');
        }
    }
};