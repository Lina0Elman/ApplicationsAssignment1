const express = require("express");

const commentsRoutes = require('./routes/comments_routes');
const postsRoutes = require('./routes/posts_routes');

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/comments', commentsRoutes);
app.use("/posts", postsRoutes);

module.exports = app;