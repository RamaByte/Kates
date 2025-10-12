import express from "express";
import { register, login, refreshToken, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register); // POST /auth/register
router.post("/login", login);       // POST /auth/login
router.post("/refresh", refreshToken); // POST /auth/refresh
router.post("/logout", logout); // optional: invalidate refresh token

export default router;
