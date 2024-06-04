const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ValidToken = AsyncHandler((req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.split(" ")[1];
        
        if (!token) {
            res.status(401);
            throw new Error("User not authorized or token is missing");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User not authorized");
            }
            req.user = decoded.user;
            next();
        });
    } else {
        res.status(401);
        throw new Error("User not authorized or token is missing");
    }
});

module.exports = ValidToken;
