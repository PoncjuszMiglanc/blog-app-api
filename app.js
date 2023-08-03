const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const userRoutes = require("./routes/user");
const app = express();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
// const upload = multer({ storage: storage });

app.use(bodyParser.json());

app.use(multer({ storage: storage }).single("image"));
app.use("/images", express.static("images"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(feedRoutes);
app.use(userRoutes);

mongoose
  .connect(
    "mongodb+srv://poncjuszmiglanc:M8JcknlXJxZwbKT7@blogapp.c9vde5p.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
    console.log(result, "Połączyliśmy się ");
  })
  .catch((err) => {
    console.log(err);
  });
// app.listen(8080);
