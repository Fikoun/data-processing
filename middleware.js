const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const authorization = req.header('Authorization')

    if (!authorization || authorization.split(" ").length < 2)
        res.status(401).json("No token!");

    const token = authorization.split(" ")[1];

    try {
        const data = jwt.verify(token, process.env.JWT_KEY)
        req.user = data;
        next();
    } catch (error) {
        return res.status(400).json("Token invalid!")
    }
}