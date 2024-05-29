const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = require('../db/users.json');


const generateToken = (user) => {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

const authenticateJWT = (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).send("You need to login");
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid token");
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
    index,
    login
}