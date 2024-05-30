const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = require('../db/users.json');


const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT, { expiresIn: '1h' });
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

module.exports = {
    generateToken,
    index,
    login,
}