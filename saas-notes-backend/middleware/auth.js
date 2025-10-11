const jwt = require("jsonwebtoken");

function auth(req, res, next) {
const token = req?.cookies?.token;
if(!token) return res.status(401).json({error: "Unauthorized token nhi h"});
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  res.status(401).json({error: "Unauthorized kuch error h"})
}
}
module.exports = auth;
