export const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  if (allowedRoles.length === 0) return next();
  if (!allowedRoles.includes(user.role)) return res.status(403).json({ error: "Forbidden - insufficient rights" });
  next();
};
