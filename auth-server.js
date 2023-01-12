const express = require('express')
const app = express()
const StatusCodes = require('http-status-codes')
const {createToken, createRefreshToken, verifyRefreshToken} = require("./utils/auth-utils")

app.use(express.json());

// Usually in actual projects this array will get stored in some aws params store
let refreshTokens = [];

app.post('/login', (req, res) => {
    //Authenticate user
    if (!req.body.username) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'There was a problem authorizing the request'
        });
    }
    const username = req.body.username;
    const user = {name: username};

    const accessToken = createToken(user);
    const refreshToken = createRefreshToken(user);
    refreshTokens.push(refreshToken);//?refreshTokens
    res.json({accessToken, refreshToken});
})

app.post('/auth', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(StatusCodes.UNAUTHORIZED);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(StatusCodes.FORBIDDEN);
    verifyRefreshToken(refreshToken, (err, user) => {
        if (err) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not Authenticated' });
        const accessToken = createToken({name: user.name});
        res.json({accessToken});
    });
})

app.delete('/logout', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(StatusCodes.UNAUTHORIZED);
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);//?refreshTokens
    res.sendStatus(StatusCodes.NO_CONTENT);
})

app.listen(3000);