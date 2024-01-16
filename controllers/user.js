const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register user, chcę potem to przepisać na async/await i z metodą create()
// @route   POST /register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.find({ $or: [{ userName }, { email }] });

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "użytkownik o podanym loginie lub mailu już istnieje",
        user: existingUser,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username: userName,
      email: email,
      password: hashedPassword,
    });

    const result = await user.save();

    res.status(201).json({
      wiadomość: "zarejestrowano użytkownika",
      user: result,
    });
  } catch (error) {
    console.lor(err);
    res.status(500).json({ wiadomość: "Wystąpił błąd podczas rejestracji" });
  }

  //Poncho sampedro@mail.com poncho666
  // const { userName, email, password } = req.body;
  // bcrypt
  //   .hash(password, 12)
  //   .then((hashedPassword) => {
  //     const user = new User({
  //       username: userName,
  //       email: email,
  //       password: hashedPassword,
  //     });
  //     return user.save();
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     res.status(201).json({
  //       wiadomość: "Zarejestrowano użytkownika",
  //       user: result,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// @desc    Login user
// @route   POST /login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, pass } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ wiadomość: "nie ma takiego użytkownika w bazie danych" });
    }

    const passwordIsOk = await bcrypt.compare(pass, user.password);

    if (!passwordIsOk) {
      return res.status(401).json({ wiadomość: "Podane hasło jest błędne" });
    }

    const token = jwt.sign({ id: user._id }, "dfgfgdfhfghfghfgh", {
      expiresIn: "2h",
    });

    res
      .cookie("jwt", token, { maxAge: 3 * 60 * 60 * 1000 })
      .status(200)
      .json({ wiadomość: "Zalogowano poprawnie", userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ wiadomość: "błąd podczas logowania" });
  }

  // const { email, pass } = req.body;
  // let loadedUser;
  // User.findOne({ email: email })
  //   .then((user) => {
  //     if (!user) {
  //       res
  //         .status(404)
  //         .json({ wiadomość: "Nie ma takiego użytkownika w bazie danych" });
  //       throw new Error("Nie znaleziono takiego użytkownika");
  //     }
  //     loadedUser = user;
  //     return bcrypt.compare(pass, user.password);
  //   })
  //   .then((passwordIsOk) => {
  //     if (!passwordIsOk) {
  //       throw new Error("Złe hasło");
  //     }
  //     const token = jwt.sign({ id: loadedUser._id }, "dfgfgdfhfghfghfgh", {
  //       expiresIn: "2h",
  //     });
  //     res
  //       .cookie("jwt", token, {
  //         maxAge: 3 * 60 * 60 * 1000,
  //       })
  //       .status(200)
  //       .json({ wiadomość: "zalogowano elegancko", token: token });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// @desc    Login user
// @route   POST /logout
// @access  Public
exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Wylogowano" });
};

exports.getUserData = async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await User.findById(id);
    //potem jeszcze z drugiego modelu weźmiemy posty.

    if (!userData) {
      return res
        .status(404)
        .json({ message: "nie znaleziono takiego użytkownika" });
    }

    res.status(200).json({ message: "oto dane użytkownika :", userData });
  } catch (err) {
    res.status(500).json({ message: "wystąpił błąd" });
    console.log(err);
  }
};
