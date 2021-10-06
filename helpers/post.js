const db = require('../config/connection');
const collection = require('../config/collection');
const objectId = require('mongodb').ObjectId;

module.exports = {
    CreateTextPost: async (userData) => {
        const textPost = await db.get().collection(collection.POST).insertOne({
            userId: objectId(userData.userId),
            postText: userData.postText,
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return textPost;
    },
    GetAllPosts: async () => {
        const posts = await db.get().collection(collection.POST).aggregate([
            { $lookup: { from: collection.USER, localField: 'userId', foreignField: '_id', as: 'userDetails' } },
            { $unwind: '$userDetails' },
            { $project: { _id: 1, userId: 1, postText: 1,likes: 1, createdAt: 1, updatedAt: 1, userDetails: { username: 1 } } }
        ]).toArray();
        return posts;
    },
    LikePost: async (likePostData) => {
        const likePost = await db.get().collection(collection.POST).updateOne({ _id: objectId(likePostData.postId) }, { $addToSet: { likes: objectId(likePostData.userId) } });
        return likePost;
    },
    UnlikePost: async (unlikePostData) => {
        console.log(unlikePostData);
        const unlikePost = await db.get().collection(collection.POST).updateOne({ _id: objectId(unlikePostData.postId) }, { $pull: { likes: objectId(unlikePostData.userId) } });
        return unlikePost;
    },
}