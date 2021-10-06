const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/connection');
const collection = require('../config/collection');
const objectId = require('mongodb').ObjectId;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true
    },
        async (req, accessToken, refreshToken, profile, done) => {
            const user = await db.get().collection(collection.USER).findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            } else {
                db.get().collection(collection.USER).insertOne({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    phonenumber: profile.phone,
                    profilepic: profile.photos[0].value,
                    role: 'user',
                    isBlocked: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    return done(null, user);
                });
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await db.get().collection(collection.USER).findOne({ _id: objectId(id) });
        done(null, user);
    });
}