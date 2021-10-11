const multer = require('multer');
const AWS = require('aws-sdk');

module.exports.s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.memoryStorage({
    destinatioin: (req, file, cb) => {
        cb(null, '');
    }
});

module.exports.upload = multer({ storage }).single('image');