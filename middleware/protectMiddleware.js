const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  //jutro logout
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "dfgfgdfhfghfghfgh");
    console.log("decodedToken : ", decodedToken);
  } catch (err) {
    console.log("decoded token :", decodedToken);
    console.log("token :", token);
    res.status(401);
    throw new Error("Zły token, sorry");
  }

  if (!decodedToken) {
    throw new Error("Nie ma tokena, nie na wejścia");
  }

  req.user = User.findById(decodedToken.id);
  next();
};
