const postHelper = require("../helpers/post");
const { s3 } = require("../middlewares/fileUpload");

module.exports = {
  CreateTextPost: async (req, res) => {
    const post = await postHelper.CreateTextPost(req.body);
    res.status(200).json({ post });
  },
  CreateImagePost: async (req, res) => {
    var fileLocation = [];
    await req.files.map(async (file) => {
      let myFile = file.originalname.split(".");
      let fileExt = myFile[myFile.length - 1];
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}.${fileExt}`,
        Body: file.buffer,
        ACL: "public-read",
      };
      await s3.upload(params, async(err, data) => {
        if (err) {
          console.log(err);
        }
        fileLocation.push(data.Location);
        if(fileLocation.length === req.files.length){
          const post = await postHelper.CreateImagePost(req.body, fileLocation);
          res.status(200).json({ post });
        }
      });
    });
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
