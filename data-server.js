const express = require('express')
const app = express()
const {authenticateToken} = require("./utils/auth-utils")

// In actual projects you will get this data from DB
const posts = [
    {
        username: 'Deepak',
        title: 'Post 1'
    },
    {
        username: 'Sharad',
        title: 'Post 1'
    },

]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.listen(4000);