const postHelper = require('../helpers/post');
const { s3 } = require('../middlewares/fileUpload');

module.exports = {
    CreateTextPost: async (req, res) => {
        console.log(req.body);
        const post = await postHelper.CreateTextPost(req.body);
        res.status(200).json({ post });
    },
    GetAllPosts: async (req, res) => {
        const posts = await postHelper.GetAllPosts();
        res.status(200).json({ posts });
    },
    LikePost: async (req, res) => {
        console.log(req.body);
        const like = await postHelper.LikePost(req.body);
        console.log(like);
        res.status(200).json({ like });
    },
    UnlikePost: async (req, res) => {
        console.log(req.body);
        const unlike = await postHelper.UnlikePost(req.body);
        console.log(unlike);
        res.status(200).json({ unlike });
    },
}