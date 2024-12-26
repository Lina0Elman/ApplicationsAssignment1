const jwt = require('jsonwebtoken');
const config = require('../config/config');

// todo - use it for all requests except for addUser? (which is like registeration)
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, config.auth.access_token, (err, user) => {
    if (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
