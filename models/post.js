const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    //jeszcze data
    category: {
      type: String,
      // required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    lead: {
      type: String,
      // required: true,
    },
    author: {
      type: String,
      // required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    content: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
