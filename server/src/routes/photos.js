import express from "express";
import {
  getPhotos,
  getPhotoById,
  createPhoto,
  updatePhoto,
  deletePhoto,
  getPhotoComments
} from "../controllers/photoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getPhotos); // GET /photos
router.get("/:id", getPhotoById); // GET /photos/:id
router.post("/", authMiddleware, roleMiddleware(["member","admin"]), createPhoto); // POST /photos
router.put("/:id", authMiddleware, roleMiddleware(["member","admin"]), updatePhoto); // PUT /photos/:id
router.delete("/:id", authMiddleware, roleMiddleware(["admin","member"]), deletePhoto); // DELETE (owner or admin)

router.get("/:id/comments", getPhotoComments); // hierarchical

export default router;
