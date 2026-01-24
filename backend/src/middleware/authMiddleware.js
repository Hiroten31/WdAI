import { verifyToken, getTokenFromRequest } from '../services/tokenService.js';

export function authMiddleware(req, res, next) {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
}
