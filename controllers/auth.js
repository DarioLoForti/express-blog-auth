const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = require('../db/users.json');


const generateToken = (user) => {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Auth Error" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Token is not valid" });
        }
        req.user = user;
        next();
    });
}

const index = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken({ username });
    res.json({ token });
}


module.exports = {
    generateToken,
    authenticateJWT,
    index
}