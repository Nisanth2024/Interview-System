const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const { authorization } = req.headers;
  console.log("Authorization header:", authorization);

  if (!authorization) {
    console.log("No authorization header");
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  console.log("Token received:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    
    // Extract user ID from decoded token
    const userId = decoded._id || decoded.id || decoded.userId;
    console.log("Extracted userId:", userId);
    
    if (!userId) {
      console.log("No user ID found in token");
      return res.status(401).json({ error: "Invalid token - no user ID" });
    }
    
    // Ensure req.user has both _id and id for downstream routes
    req.user = { 
      _id: userId, 
      id: userId, 
      ...decoded 
    };
    console.log("Final req.user:", req.user);
    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    res.status(401).json({ error: "Request not authorized" });
  }
};
