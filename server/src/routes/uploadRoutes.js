// src/routes/uploadRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "uploads");

// užtikrinam, kad uploads aplankas egzistuoja
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
        cb(null, `${Date.now()}_${base}${ext}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"));
        } else {
            cb(null, true);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /upload/photo  – priima vieną failą "file", grąžina { url }
router.post("/photo", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const proto = req.headers["x-forwarded-proto"] || req.protocol;
    const publicUrl = `${proto}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(201).json({ url: publicUrl });
});

export default router;
