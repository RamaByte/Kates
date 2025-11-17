import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(404).json({ error: "Trūksta Authorization header" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(400).json({ error: "Neteisingas Authorization formatas" });
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(404).json({ error: "Vartotojas nerastas" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(422).json({ error: "Neleistinas ar pasibaigęs tokenas" });
  }
};
