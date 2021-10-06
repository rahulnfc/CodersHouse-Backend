const db = require('../config/connection');
const collection = require('../config/collection');
const objectId = require('mongodb').ObjectId;

module.exports = {
    GetUser: async (userId) => {
        const user = await db.get().collection(collection.USER).findOne({ _id: objectId(userId) }, { projection: { password: 0 } });
        return user;
    },
    FollowUser: async (userId, followId) => {
        let following = await db.get().collection(collection.USER).findOneAndUpdate({ _id: objectId(userId) }, { $addToSet: { following: objectId(followId) } });
        let follower = await db.get().collection(collection.USER).findOneAndUpdate({ _id: objectId(followId) }, { $addToSet: { followers: objectId(userId) } });
        return { following, follower };
    },
    UnfollowUser: async (userId, followId) => {
        let following = await db.get().collection(collection.USER).findOneAndUpdate({ _id: objectId(userId) }, { $pull: { following: objectId(followId) } });
        let follower = await db.get().collection(collection.USER).findOneAndUpdate({ _id: objectId(followId) }, { $pull: { followers: objectId(userId) } });
        return { following, follower };
    },
    GetFollowing: async (userId) => {
        const user = await db.get().collection(collection.USER).aggregate([
            { $match: { _id: objectId(userId) } },
            { $unwind: '$following' },
            { $lookup: { from: collection.USER, localField: 'following', foreignField: '_id', as: 'following' } },
            { $unwind: '$following' },
            { $project: { _id: 0, following: 1 } }
        ]).toArray();
        return user;
    },
    GetFollowers: async (userId) => {
        const user = await db.get().collection(collection.USER).aggregate([
            { $match: { _id: objectId(userId) } },
            { $unwind: '$followers' },
            { $lookup: { from: collection.USER, localField: 'followers', foreignField: '_id', as: 'followers' } },
            { $unwind: '$followers' },
            { $project: { _id: 0, followers: 1 } }
        ]).toArray();
        return user;
    },
    GetConnections: async (userId) => {
        const user = await db.get().collection(collection.USER).aggregate([
            { $match: { _id: objectId(userId) } },
            { $unwind: '$following' },
            { $lookup: { from: collection.USER, localField: 'following', foreignField: '_id', as: 'following' } },
            { $unwind: '$following' },
            { $project: { _id: 0, following: 1 } },
            { $unwind: '$following' },
            { $lookup: { from: collection.USER, localField: 'following.followers', foreignField: '_id', as: 'following.followers' } },
            { $unwind: '$following.followers' },
            { $project: { _id: 0, following: 1 } }
        ]).toArray();
        return user;
    },
    GetUserById: async (userId) => {
        const user = await db.get().collection(collection.USER).findOne({ _id: objectId(userId) }, { projection: { password: 0 } });
        return user;
    },
    GetPeopleYouMayKnow: async (userId) => {
        const people = await db.get().collection(collection.USER).aggregate([
            { $match: { _id: { $ne: objectId(userId) } } },
            { $lookup: { from: collection.USER, localField: 'followers', foreignField: '_id', as: 'followers' } },
            { $unwind: '$followers' },
            { $match: { 'followers._id': { $ne: objectId(userId) } } },
            { $lookup: { from: collection.USER, localField: 'followers.followers', foreignField: '_id', as: 'followers.followers' } },
            { $unwind: '$followers.followers' },
            { $match: { 'followers.followers._id': { $ne: objectId(userId) } } },
            { $project: { _id: 0, followers: 1 } }
        ]).toArray();
        return people;
    },
    UpdateProfile: async (userData) => {
        const user = await db.get().collection(collection.USER).findOneAndUpdate({ _id: objectId(userData.userId) }, {
            $set: {
                name: userData.name,
                email: userData.email,
                phone_number: userData.phone_number,
                Domain: userData.Domain,
                DOB: userData.DOB,
                About: userData.About,
                updatedAt: new Date()
            }
        });
        return user;
    },
    AddWork: async (workData) => {
        const work = await db.get().collection(collection.WORK).insertOne({
            userId: objectId(workData.userId),
            title: workData.title,
            company: workData.company,
            location: workData.location,
            startDate: workData.startDate,
            endDate: workData.endDate,
            updatedAt: new Date()
        });
        return work;
    },
    RemoveWork: async (workId) => {
        const work = await db.get().collection(collection.WORK).findOneAndDelete({ _id: objectId(workId) });
        return work;
    },
    UpdateWork: async (workId, workData) => {
        const work = await db.get().collection(collection.WORK).findOneAndUpdate({ _id: objectId(workId) }, {
            $set: {
                title: workData.title,
                company: workData.company,
                location: workData.location,
                startDate: workData.startDate,
                endDate: workData.endDate,
                updatedAt: new Date()
            }
        });
        return work;
    },
    AddEducation: async (educationData) => {
        const education = await db.get().collection(collection.EDUCATION).insertOne({
            userId: objectId(educationData.userId),
            university: educationData.university,
            location: educationData.location,
            startDate: educationData.startDate,
            endDate: educationData.endDate,
            updatedAt: new Date()
        });
        return education;
    },
    RemoveEducation: async (educationId) => {
        const education = await db.get().collection(collection.EDUCATION).findOneAndDelete({ _id: objectId(educationId) });
        return education;
    },
    UpdateEducation: async (educationId,educationData) => {
        const education = await db.get().collection(collection.EDUCATION).findOneAndUpdate({ _id: objectId(educationId) }, {
            $set: {
                university: educationData.university,
                location: educationData.location,
                startDate: educationData.startDate,
                endDate: educationData.endDate,
                updatedAt: new Date()
            }
        });
        return education;
    }

};
