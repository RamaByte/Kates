import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import albumRoutes from "./routes/albums.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import photosRoutes from "./routes/photos.js";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/uploadRoutes.js";

// Swagger
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("swagger.yaml");

// Photo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/albums", albumRoutes);
app.use("/auth", authRoutes);
app.use("/comments", commentRoutes);
app.use("/photos", photosRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

// upload API
app.use("/upload", uploadRoutes);

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check & root
app.get("/", (req, res) => res.json({ message: "Kates API is running" }));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Server start
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server is running: http://${HOST}:${PORT}/`);
  console.log(`Swagger UI: http://${HOST}:${PORT}/api-docs`);
});
