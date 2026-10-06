// middleware/authMiddleware.js
// Middleware to verify JWT token and check admin privileges

const jwt = require('jsonwebtoken');

// Verify if request has a valid JWT token in Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token string
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_event_management_jwt_key_2026');
    // Attach decoded user info to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check if the authenticated user has 'admin' role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { verifyToken, isAdmin };
