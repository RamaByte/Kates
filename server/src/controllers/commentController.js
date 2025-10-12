import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({ include: { user: { select: { id: true, name: true } }, photo: true } });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, photoId } = req.body;
    if (!content || !photoId) return res.status(400).json({ error: "Missing fields" });
    if (!req.user.id) return res.status(401).json({ error: "Login required" });

    // ensure photo exists
    const photo = await prisma.photo.findUnique({ where: { id: Number(photoId) } });
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    const comment = await prisma.comment.create({ data: { content, userId: req.user.id, photoId: Number(photoId) } });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Comment not found" });

    // only owner or admin
    if (existing.userId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { content } = req.body;
    const updated = await prisma.comment.update({ where: { id }, data: { content } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Comment not found" });

    if (existing.userId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    await prisma.comment.delete({ where: { id } });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
