const Post = require("../models/post");

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

  // const { category, title, lead, author, image, content } = req.body;

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

exports.deletePost = (req, res, next) => {
  const postId = req.body.id;

  if (!postId) {
    return res.status(400).json({ error: "brak id posta w requeście" });
  }

  Post.findByIdAndDelete(postId)
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(404).json({ error: "post o takim id nie istnieje" });
      }
      res.json({ message: "udało się usunąć posta" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ błąd: "wystąpił błąd podczas usuwania posta" });
    });

  //jeszcze zeby img usuwal stad
};
