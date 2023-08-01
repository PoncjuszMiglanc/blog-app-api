exports.getPosts = (req, res, next) => {
  res.status(200).json({
    wiadomosc: "Cześć to moja odpowiedź",
  });
};

exports.postPost = (req, res, next) => {
  res.status(200).json({
    wiadomość: "cześć",
    mail: req.body.email,
    pass: req.body.pass,
  });
};
