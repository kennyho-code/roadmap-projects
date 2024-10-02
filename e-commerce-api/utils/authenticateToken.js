import { decrypt } from "./session.js";

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const payload = await decrypt(token);
  if (!payload) {
    return res.sendStatus(403);
  }
  const { email } = payload;
  req.emailFromToken = email;
  next();
}

export default authenticateToken;
