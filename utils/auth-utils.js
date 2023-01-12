const jwt = require('jsonwebtoken')
require('dotenv').config()
const StatusCodes = require('http-status-codes')

const createToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '30s' });
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS256' });
}

const verifyToken = (token, cb) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, cb);
}

const verifyRefreshToken = (token, cb) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, cb);
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing Header' });
    
    const [,token] = authHeader.split(' ');
    if (token == null) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'There was a problem authorizing the request' });
    
    verifyToken(token, (err, user) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not Authenticated' });
        req.user = user;
        next();
    });
}

module.exports = {
    createToken,
    createRefreshToken,
    verifyRefreshToken,
    authenticateToken
}