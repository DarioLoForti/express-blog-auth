module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.format({
        html: () => {
            res.status(statusCode).send(`<h1>${err.message}</h1>`);
        },
        json: () => {
            res.status(statusCode).json({ error: err.message, stack: err.stack});
        }
    });
}