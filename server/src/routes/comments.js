import express from "express";
import {
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  getComments
} from "../controllers/commentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getComments); // GET /comments
router.get("/:id", getCommentById); // GET /comments/:id
router.post("/", authMiddleware, roleMiddleware(["member","admin"]), createComment); // POST /comments
router.put("/:id", authMiddleware, roleMiddleware(["member","admin"]), updateComment); // PUT /comments/:id
router.delete("/:id", authMiddleware, roleMiddleware(["admin","member"]), deleteComment); // DELETE (owner or admin)

export default router;
