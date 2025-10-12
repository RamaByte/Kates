import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createAccessToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "member" } // registrations become members
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // store refresh token in DB (optional but recommended)
    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    // return tokens
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "No refresh token" });

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ error: "Refresh token not recognized" });

    const newAccess = createAccessToken(user);
    const newRefresh = createRefreshToken(user);

    await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefresh } });

    res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
