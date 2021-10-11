const postHelper = require("../helpers/post");
const { s3 } = require("../middlewares/fileUpload");

module.exports = {
  CreateTextPost: async (req, res) => {
    const post = await postHelper.CreateTextPost(req.body);
    res.status(200).json({ post });
  },
  CreateImagePost: async (req, res) => {
    console.log(req.body);
  },
  GetAllPosts: async (req, res) => {
    const posts = await postHelper.GetAllPosts();
    res.status(200).json({ posts });
  },
  LikePost: async (req, res) => {
    const like = await postHelper.LikePost(req.body);
    res.status(200).json({ like });
  },
  UnlikePost: async (req, res) => {
    const unlike = await postHelper.UnlikePost(req.body);
    res.status(200).json({ unlike });
  },
};
