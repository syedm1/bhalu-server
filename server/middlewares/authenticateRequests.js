exports.authenticateRequests = (req, res, next) => {
  const isPublic = req.path.includes("public");
  if (!req.isAuthenticated() && !isPublic) {
    return res
      .status(401)
      .json({ authenticated: false, message: "User is not authorized" });
  } else {
    next();
  }
};
