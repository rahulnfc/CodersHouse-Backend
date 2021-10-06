const db = require('../config/connection');
const collection = require('../config/collection');
const bcrypt = require('bcrypt');

module.exports = {
    Login: async (userData) => {
        const blocked = await db.get().collection(collection.USER).findOne({ email: userData.email, isBlocked: true });
        if (blocked) { return {userBlocked: true}; }        
        const user = await db.get().collection(collection.USER).findOne({ email: userData.email });
        if (user){ 
            const isValid = await bcrypt.compare(userData.password, user.password);
            if (isValid) {
                return { user: true, data: user };
            } else {
                return { passwordError: true };
            }
        } else {
            return { emailError: true };
        }
    },
    Register: async (userData) => {
        const emailExist = await db.get().collection(collection.USER).findOne({ email: userData.email });
        if (!emailExist) {
            const phoneExist = await db.get().collection(collection.USER).findOne({ phone_number: userData.phone_number });
            if (!phoneExist) {
                userData.password = await bcrypt.hash(userData.password, 10);
                const user = await db.get().collection(collection.USER).insertOne({
                    username: userData.username,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    password: userData.password,
                    role: 'user',
                    isBlocked: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                return { user: true, data: user };
            } else {
                return { phonenumberError: true };
            }
        } else {
            return { emailError: true };
        }
    },
    GoogleWithPassword: async (userData) => {
        const googleId = await db.get().collection(collection.USER).findOne({ googleId: userData.googleId });
        if (googleId) {
            userData.password = await bcrypt.hash(userData.password, 10);
            const user = await db.get().collection(collection.USER).updateOne(
                { googleId: userData.googleId },
                { $set: { password: userData.password } }
            );
            return { user: true, data: user };
        } else {
            return { googleIdError: true };
        }
    },
    isEmailValid: async (email) => {
        const user = await db.get().collection(collection.USER).findOne({ email: email });
        if (user) {
            return { user: true, data: user };
        }
        return { user: false };
    }
};