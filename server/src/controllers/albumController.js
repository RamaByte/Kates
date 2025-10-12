import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAlbums = async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: { photos: { select: { id: true, title: true, imageUrl: true } }, user: { select: { id: true, name: true } } }
    });
    res.json(albums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAlbumById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const album = await prisma.album.findUnique({
      where: { id },
      include: { photos: true, user: { select: { id: true, name: true } } }
    });
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });
    if (!req.user.id) return res.status(401).json({ error: "Login required" });

    const album = await prisma.album.create({
      data: { title, description: description || null, userId: req.user.id }
    });
    res.status(201).json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.album.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Album not found" });
    // only owner or admin
    if (existing.userId !== req.user.id && req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const { title, description } = req.body;
    const updated = await prisma.album.update({ where: { id }, data: { title, description } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.album.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Album not found" });
    // only admin can delete (route already protected)
    await prisma.album.delete({ where: { id } });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAlbumPhotos = async (req, res) => {
  try {
    const albumId = Number(req.params.id);
    const photos = await prisma.photo.findMany({ where: { albumId } });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
