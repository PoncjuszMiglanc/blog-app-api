const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const userRoutes = require("./routes/user");
const app = express();

app.use(bodyParser.json());

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
