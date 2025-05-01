import jwt from "jsonwebtoken";

export function verifyAdminToken(req, res, next) {
  // Get Token from Header
  const token = req.header("x-auth-token");
  // Check if no Token
  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  // Verify
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_KEY);
    if (decoded && !decoded.user)
      return res.status("401").json({ msg: "Token is not valide" });
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status("401").json({ msg: "Token is not valide" });
  }
}
