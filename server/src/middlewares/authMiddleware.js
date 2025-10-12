// backend/src/middlewares/authMiddleware.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Jei ateina header X-User-Id => užkrauna vartotoją į req.user.
 * Jei nėra header — req.user = { role: "guest" }.
 * Naudoma tik laborui / demo; vėliau galima pakeisti į JWT.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const userIdHeader = req.header("X-User-Id");
    if (!userIdHeader) {
      // guest
      req.user = { role: "guest" };
      return next();
    }

    const userId = Number(userIdHeader);
    if (Number.isNaN(userId)) return res.status(400).json({ error: "Bad X-User-Id header" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = { id: user.id, role: user.role, name: user.name };
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
