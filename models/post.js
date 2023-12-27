const mongoose = require("mongoose");

//chodzi o to, żeby w poscie była jeszcze jedna kolumna z id autora , żeby było jasne,
// jakie posty autor może edytowac i usuwać,i jakie wyświetlają się w jego profilu
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
