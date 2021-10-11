const db = require("../config/connection");
const collection = require("../config/collection");
const objectId = require("mongodb").ObjectId;

module.exports = {
  CreateTextPost: async (userData) => {
    try {
      const textPost = await db
        .get()
        .collection(collection.POST)
        .insertOne({
          userId: objectId(userData.userId),
          postText: userData.postText,
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      return textPost;
    } catch (error) {
      throw error;
    }
  },
  CreateImagePost: async (userData) => {
    console.log(userData);
    try {
      if (userData.textPost !== '') {
        const imagePost = await db
          .get()
          .collection(collection.POST)
          .insertOne({
            userId: objectId(userData.userId),
            postText: userData.textPost,
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        return imagePost;
      } else {
        const imagePost = await db
          .get()
          .collection(collection.POST)
          .insertOne({
            userId: objectId(userData.userId),
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        return imagePost;
      }
    } catch (error) {
      throw error;
    }
  },
  GetAllPosts: async () => {
    try {
      const posts = await db
        .get()
        .collection(collection.POST)
        .aggregate([
          {
            $lookup: {
              from: collection.USER,
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          { $unwind: "$userDetails" },
          {
            $project: {
              _id: 1,
              userId: 1,
              postText: 1,
              likes: 1,
              createdAt: 1,
              updatedAt: 1,
              userDetails: { username: 1 },
            },
          },
        ])
        .toArray();
      return posts;
    } catch (error) {
      throw error;
    }
  },
  LikePost: async (likePostData) => {
    const likePost = await db
      .get()
      .collection(collection.POST)
      .updateOne(
        { _id: objectId(likePostData.postId) },
        { $addToSet: { likes: objectId(likePostData.userId) } }
      );
    return likePost;
  },
  UnlikePost: async (unlikePostData) => {
    const unlikePost = await db
      .get()
      .collection(collection.POST)
      .updateOne(
        { _id: objectId(unlikePostData.postId) },
        { $pull: { likes: objectId(unlikePostData.userId) } }
      );
    return unlikePost;
  },
};
