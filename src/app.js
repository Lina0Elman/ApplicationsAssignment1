const express = require("express");

const commentsRoutes = require('./routes/comments_routes');
const postsRoute = require('./routes/posts_routes');

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const commentsRoutes = require('./routes/comments');

app.use('/comments', commentsRoutes);
app.use("/posts", postsRoute);

module.exports = app;