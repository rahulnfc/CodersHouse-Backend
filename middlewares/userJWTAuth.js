const jwt = require('jsonwebtoken');

module.exports = {
    checkLoggedIn: (req, res, next) => {
        // split token from headers authorization
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({invalidToken:true});
                } else {
                    next();
                }
            });
        } else {
            return res.status(401).json({ noToken: true });
        }
    }
}



