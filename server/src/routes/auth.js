import express from "express";
import { register, login, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register); // POST /auth/register
router.post("/login", login);       // POST /auth/login
router.post("/refresh", refresh); // POST /auth/refresh
router.post("/logout", logout); // POST /auth/logout

export default router;
