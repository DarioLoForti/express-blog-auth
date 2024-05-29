const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = require('../db/users.json');


const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT, { expiresIn: '1h' });
}

const authenticateJWT = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).send("You need to login");
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

const index = (req, res) => {
    res.send('Auth index');
}

const login = (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).send("Invalid username or password");
    }
    const token = generateToken(user);
    res.send(token);
}

const isAdmin = (req, res, next) => {
    const { username, password } = req.user;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user || !user.isAdmin) {
        return res.status(403).send("You are not an admin");
    }
    next();
}


module.exports = {
    generateToken,
    authenticateJWT,
    index,
    login,
    isAdmin
}