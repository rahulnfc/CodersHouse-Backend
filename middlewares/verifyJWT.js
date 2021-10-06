const jwt = require("jsonwebtoken");
module.exports = {
    verifyToken: (req, res, next) => {
        // get token from query string
        const token = req.query.token;
        console.log(token);
        if (token == undefined || token == null) {
            console.log("token not found");
            res.status(401).json({ tokenNotFound: true });
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log("token not verified");
                    res.status(401).json({ message: "Invalid Token" });
                } else {
                    console.log("token verified");
                    next();
                }
            });
        }
    },
    checkUser: (req, res, next) => {
        const token = req.cookies.userjwt;
        if (token) {
            res.json({ status: false, logged: false });
        } else {
            next();
        }
    },
};