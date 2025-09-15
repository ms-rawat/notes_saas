const jwt = require("jsonwebtoken");

function auth(req, res, next) {
const token = req.cookie.token;
if(!token) return res.status(401).json({error: "Unauthorized"});
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  res.status(401).json({error: "Unauthorized"})
}
}

module.exports = auth;
