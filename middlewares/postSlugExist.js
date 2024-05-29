const posts = require('../db/db.json');

module.exports = (req, res, next) => {
    const {slug} = req.params;
    const post = posts.find(p => p.slug === slug);
    if (!post) {
        return res.status(404).send(`Post ${slug} not found`);
    }
    req.post = post;
    next(); 
}