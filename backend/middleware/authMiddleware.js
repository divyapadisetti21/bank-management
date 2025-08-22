const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const bearer = req.headers['authorization'];
  const headerToken = bearer && bearer.startsWith('Bearer ') ? bearer.split(' ')[1] : null;
  const cookieToken = req.cookies?.token;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
