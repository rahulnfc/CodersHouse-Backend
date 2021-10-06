require('dotenv/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./config/connection');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

// Config passport
require('./middlewares/userPassportAuth')(passport);

// Config Express
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

// Connect Database
db.connect((err) => {
    if (err) return console.log('Error connecting to database:', err);
    else console.log('Database connected to successfully! 💯💯💯');
});

// Config Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);

// Start Server
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server listening on port ${process.env.PORT || 3001} 🚀🚀🚀`);
});