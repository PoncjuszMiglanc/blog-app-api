const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ wiadomość: "nie ma tokena, brak dostępu" });
  }

  try {
    const decodedToken = jwt.verify(token, "dfgfgdfhfghfghfgh");

    if (!decodedToken) {
      return res.status(401).json({ wiadomość: "zły token, brak dostępu" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ wiadomość: "użytkownik nie istnieje" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("błąd weryfikacji tokena", error);
    return res.status(500).json({ error: "nieudana weryfikacja tokena" });
  }

  // const token = req.cookies.jwt;

  // let decodedToken;
  // try {
  //   decodedToken = jwt.verify(token, "dfgfgdfhfghfghfgh");
  //   console.log("decodedToken : ", decodedToken);
  // } catch (err) {
  //   console.log("decoded token :", decodedToken);
  //   console.log("token :", token);
  //   res.status(401);
  //   throw new Error("Zły token, sorry");
  // }

  // if (!decodedToken) {
  //   throw new Error("Nie ma tokena, nie na wejścia");
  // }

  // req.user = User.findById(decodedToken.id);
  // next();
};
