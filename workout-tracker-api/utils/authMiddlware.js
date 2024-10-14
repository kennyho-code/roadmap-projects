import supabase from "./supabase.js";

async function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  req.user = user;
  next();
}

export default authMiddleware;
