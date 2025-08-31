const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');

function auth(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      if (!required) return next();
      return res.status(401).json({ success: false, message: 'Token ausente' });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
    }
  };
}

module.exports = auth;


