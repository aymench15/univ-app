import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export function verifyToken(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded && !decoded.user)
      return res.status(401).json({ msg: "Token is not valide" });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valide" });
  }
}
export const authorizeRole = (role) => (req, res, next) => {
  if (!role) return res.sendStatus(403);
  if (Array.isArray(role)) {
    if (role.includes(req.user.role)) {
      return next();
    } else {
      return res.sendStatus(403);
    }
  } else {
    if (req.user.role === role) {
      return next();
    }
  }
  return res.sendStatus(403);
};
