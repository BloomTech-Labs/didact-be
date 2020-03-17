const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { urlencoded, json } = require('body-parser');
const { resolve } = require('path');

const authRouter = require("../auth/authRouter");
const facebookAuth = require("../auth/facebookAuth");
const googleAuth = require("../auth/googleAuth");
const coursesRouter = require("../courses/coursesRouter");
const tagsRouter = require("../tags/tagsRouter");
const udemyCoursesRouter = require("../courses/udemyCoursesRouter");
const learningPathsRouter = require("../learning-paths/learningPathsRouter");
const articlesRouter = require('../resources/articlesRouter');
const toolsRouter = require('../resources/toolsRouter');
const sourcesRouter = require('../resources/sourcesRouter');

const { cloudConfig, uploader } = require("./cloudinaryConfig.js");
const { multerUploads, dataUri } = require('../uploads/multer');

const server = express();
const restricted = require("../utils/restricted");
server.use(cors());
server.use(helmet());

server.use(express.static(resolve(__dirname, 'src/public')));
server.use(urlencoded({ extended: false }));
// server.use(json());
server.use('*', cloudConfig);

server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/auth/facebook", facebookAuth);
server.use("/api/auth/google", googleAuth);
server.use("/api/courses", restricted, coursesRouter);
server.use("/api/tags", restricted, tagsRouter);
server.use("/api/docs", express.static("./docs"));
server.use("/api/udemy", restricted, udemyCoursesRouter);
server.use("/api/learning-paths", restricted, learningPathsRouter);
server.use("/api/articles", restricted, articlesRouter);
server.use("/api/tools", restricted, toolsRouter);
server.use("/api/sources", restricted, sourcesRouter);

server.get("/", (req, res) => {
  res.send("server is running");
});

// server.use("*", cloudConfig);
// server.get('/upload', (req, res) => res.sendFile(resolve(__dirname, '../public/index.html')));
server.post('/upload', multerUploads, (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;
    return uploader.upload(file).then((result) => {
      const image = result.url;
      return res.status(200).json({
        messge: 'Your image has been uploaded successfully to cloudinary',
        data: {
          image
        }
      })
    }).catch((err) => res.status(400).json({
      messge: 'someting went wrong while processing your request',
      data: {
        err
      }
    }))
  }
});

module.exports = server;
