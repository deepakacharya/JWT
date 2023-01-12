const express = require('express')
const app = express()
const {authenticateToken} = require("./utils/auth-utils")

const posts = [
    {
        username: 'Deepak',
        title: 'Post 1'
    },
    {
        username: 'Alok',
        title: 'Post 1'
    },

]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.listen(4000);