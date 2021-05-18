const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
  const token= req.headers.authorization.split(" ")[1];
  const decodedToken= jwt.verify(token, "my-32-character-ultra-secure-and-ultra-long-secret");
  req.userData = {email: decodedToken.email, userId: decodedToken.userId};
  next();
  } catch (error) {
    res.status(401).json({message: "You are not authenticated!"});
  }
};
