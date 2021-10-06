const userHelper = require('../helpers/user');
const { s3 } = require('../middlewares/fileUpload');

module.exports = {
    GetMe: async (req, res) => {
        // split userId from headers authorization
        const userId = req.headers.authorization.split(' ')[2];
        const user = await userHelper.GetUser(userId);
        res.status(200).json({user});
    },
    Follow: async (req, res) => {
        const user = await userHelper.FollowUser(req.body.userId, req.params.id);
        res.status(200).json(user);
    },
    Unfollow: async (req, res) => {
        const user = await userHelper.UnfollowUser(req.body.userId, req.params.id);
        res.status(200).json(user);
    },
    Following: async (req, res) => {
        const user = await userHelper.GetFollowing(req.body.userId);
        res.status(200).json(user);
    },
    Followers: async (req, res) => {
        const user = await userHelper.GetFollowers(req.body.userId);
        res.status(200).json(user);
    },
    Connections: async (req, res) => {
        const user = await userHelper.GetConnections(req.body.userId);
        res.status(200).json(user);
    },
    GetUser: async (req, res) => {
        const user = await userHelper.GetUserById(req.params.id);
        res.status(200).json(user);
    },
    PeopleYouMayKnow: async (req, res) => {
        const user = await userHelper.GetPeopleYouMayKnow(req.body.userId);
        res.status(200).json(user);
    },
    UploadProfileImage: async (req, res) => {
        let myFile = req.file.originalname.split('.')
        const fileType = myFile[myFile.length - 1];
    
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${req.body.userId}.${fileType}`,
            Body: req.file.buffer
        };
    
        s3.upload(params, (error, data) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(data);
            }
        });
    },
    DeleteProfileImage: async (req, res) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.params.id
        };

        s3.delete(params, (error, data) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(data);
            }
        });
    },
    UploadCoverImage: async (req, res) => {
        let myFile = req.file.originalname.split('.')
        const fileType = myFile[myFile.length - 1];
    
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}.${fileType}`,
            Body: req.file.buffer
        };
    
        s3.upload(params, (error, data) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(data);
            }
        });
    },
    DeleteCoverImage: async (req, res) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: req.params.id
        };

        s3.delete(params, (error, data) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(data);
            }
        });
    },
    UpdateProfile: async (req, res) => {
        const user = await userHelper.UpdateProfile(req.body);
        res.status(200).json(user);
    },
    AddWork: async (req, res) => {
        const work = await userHelper.AddWork(req.body);
        res.status(200).json(work);
    },
    RemoveWork: async (req, res) => {
        const work = await userHelper.RemoveWork(req.params.id);
        res.status(200).json(work);
    },
    UpdateWork: async (req, res) => {
        const work = await userHelper.UpdateWork(req.params.id, req.body);
        res.status(200).json(work);
    },
    AddEducation: async (req, res) => {
        const education = await userHelper.AddEducation(req.body);
        res.status(200).json(education);
    },
    RemoveEducation: async (req, res) => {
        const education = await userHelper.RemoveEducation(req.params.id);
        res.status(200).json(education);
    },
    UpdateEducation: async (req, res) => {
        const education = await userHelper.UpdateEducation(req.params.id, req.body);
        res.status(200).json(education);
    }
}