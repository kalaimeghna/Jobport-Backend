export const employerOnly = (req, res, next) => {
  // check user exists
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // check employer role
  if (req.user.role !== "employer") {
    return res.status(403).json({
      success: false,
      message: "Employer access only",
    });
  }

  next();
};