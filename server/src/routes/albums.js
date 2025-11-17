import express from "express";
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  getAlbumPhotos
} from "../controllers/albumController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAlbums); // GET /albums
router.get("/:id", getAlbumById); // GET /albums/:id
router.post("/", authMiddleware, roleMiddleware(["member", "admin"]), createAlbum); // POST
router.put("/:id", authMiddleware, roleMiddleware(["member", "admin"]), updateAlbum); // PUT
router.delete("/:id", authMiddleware, roleMiddleware(["member", "admin"]), deleteAlbum); // DELETE

router.get("/:id/photos", getAlbumPhotos); // hierarchical

export default router;
