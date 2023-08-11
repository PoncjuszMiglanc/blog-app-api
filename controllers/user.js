const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register user, chcę potem to przepisać na async/await i z metodą create()
// @route   /register
// @access  Public
exports.register = (req, res, next) => {
  const { userName, email, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        username: userName,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        wiadomość: "Zarejestrowano użytkownika",
        user: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// @desc    Login user
// @route   /login
// @access  Public
exports.login = (req, res, next) => {
  const { email, pass } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        throw new Error("Nie znaleziono takiego użytkownika");
      }
      loadedUser = user;
      return bcrypt.compare(pass, user.password);
    })
    .then((passwordIsOk) => {
      if (!passwordIsOk) {
        throw new Error("Złe hasło");
      }
      const token = jwt.sign({ id: loadedUser._id }, "dfgfgdfhfghfghfgh", {
        expiresIn: "1h",
      });
      res
        .cookie("jwt", token)
        .status(200)
        .json({ wiadomość: "zalogowano elegancko", token: token });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.logout = (req, res, next) => {
  res.status(200).json({ message: "elo" });
};
