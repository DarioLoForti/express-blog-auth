
const users = require('../db/users.json');
const auth = require('../middlewares/authenticateJWT');

const index = (req, res) => {
    res.send('Auth index');
}

const login = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).send("Invalid username or password");
    }

    const token = auth.generateToken(user);

    res.send(token);
}

module.exports = {
    index,
    login,
}