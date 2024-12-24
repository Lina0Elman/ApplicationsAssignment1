import express from "express";
import commentsRoutes from "./routes/comments_routes";
import postsRoutes from "./routes/posts_routes";

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/comments', commentsRoutes);
app.use("/posts", postsRoutes);

export default app;