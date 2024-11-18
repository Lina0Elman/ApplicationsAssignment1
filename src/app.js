const express = require("express");
const postsRoute = require('./routes/posts_route');

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/posts", postsRoute);

module.exports = app;