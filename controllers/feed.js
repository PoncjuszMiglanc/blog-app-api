const Post = require("../models/post");
//chya nie powinno się wrzucac obrazków do githuba
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((result) => {
      res.status(200).json({
        wiadomosc: "Cześć to są posty:",
        posty: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPost = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .then((result) => {
      res.status(200).json({ message: "mamy posta", post: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// /post
exports.postPost = (req, res, next) => {
  const category = req.body.category;
  const title = req.body.title;
  const lead = req.body.lead;
  const author = req.body.author;
  const image = req.file.filename;
  const content = req.body.content;

  // res.status(201).json({
  //   wiadomość: "Utworzono posta",
  //   // post: result,
  //   kategoria: kategoria,
  //   tytuł: tytuł,
  //   lead: lead,
  //   autor: autor,
  //   image: image,
  //   treść: treść,
  // });

  const post = new Post({
    category: category,
    title: title,
    lead: lead,
    author: author,
    image: image,
    content: content,
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        wiadomość: "Utworzono posta",
        post: result,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
