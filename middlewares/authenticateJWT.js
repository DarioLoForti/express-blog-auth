const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT, { expiresIn: '1h' });
}


const authenticateJWT = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.format({
            'text/html': function () {
                res.status(401).send("<h2>You need to login</h2>");
            },
            'json': function () {
                res.status(401).json({ error: "You need to login" });
            }
        });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send("Token expired");
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).send("Invalid token");
            } else {
                return res.status(403).send("Token verification failed");
            }
        }

        req.user = user;
        next();
    });
}

const isAdmin = (req, res, next) => {
    const { username, password, admin } = req.user;
    const user = users.find(u => u.username === username && u.password === password && u.admin === admin);
    if (!user || !user.admin) {
        return res.status(403).send("You are not an admin");
    }
    req.user.admin = true
    next();
}


module.exports = {
    generateToken,
    authenticateJWT,
    isAdmin
}