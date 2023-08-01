exports.register = (req, res, next) => {
  res.status(200).json({
    wiadomość: "wysłano dane do rejestracji",
    login: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
};

exports.login = (req, res, next) => {
  res.status(200).json({
    wiadomość: "Podano dane do logowania",
    login: req.body.email,
    haslo: req.body.pass,
  });
};
