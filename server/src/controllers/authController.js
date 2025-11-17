import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../utils/jwt.js";

const prisma = new PrismaClient();

const buildAuthResponse = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = await createRefreshToken(user);
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email ir password būtini" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(422).json({ error: "Vartotojas su tokiu el. paštu jau yra" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Registruojamas member
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "member",
      },
    });

    const auth = await buildAuthResponse(user);

    return res.status(201).json(auth);
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "Serverio klaida" });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email ir password būtini" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(422).json({ error: "Neteisingi prisijungimo duomenys" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(422).json({ error: "Neteisingi prisijungimo duomenys" });
    }

    const auth = await buildAuthResponse(user);

    res.json(auth);
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Serverio klaida" });
  }
};

// POST /auth/refresh
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Trūksta refreshToken" });
    }

    const { payload, tokenRecord } = await verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return res.status(404).json({ error: "Vartotojas nerastas" });
    }

    await revokeRefreshToken(tokenRecord.tokenId);

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = await createRefreshToken(user);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(422).json({ error: "Neleistinas refresh tokenas" });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Trūksta refreshToken" });
    }

    try {
      const { payload, tokenRecord } = await verifyRefreshToken(refreshToken);
      await revokeRefreshToken(tokenRecord.tokenId);
    } catch (e) {
    }

    return res.status(200).json({ message: "Atsijungta" });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ error: "Serverio klaida" });
  }
};
