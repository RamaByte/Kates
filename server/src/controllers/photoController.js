import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPhotos = async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({ include: { comments: true, album: { select: { id: true, title: true } } } });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPhotoById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const photo = await prisma.photo.findUnique({ where: { id }, include: { comments: true } });
    if (!photo) return res.status(404).json({ error: "Photo not found" });
    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createPhoto = async (req, res) => {
  try {
    const { title, description, imageUrl, albumId } = req.body;
    if (!title || !imageUrl || !albumId) return res.status(400).json({ error: "Missing fields" });
    if (!req.user.id) return res.status(401).json({ error: "Login required" });
    try {
      new URL(imageUrl);
    } catch {
      return res.status(422).json({ error: "Invalid image URL" });
    }

    // verify album exists
    const album = await prisma.album.findUnique({ where: { id: Number(albumId) } });
    if (!album) return res.status(404).json({ error: "Album not found" });

    const photo = await prisma.photo.create({
      data: { title, description: description || null, imageUrl, albumId: Number(albumId), uploadedById: req.user.id }
    });
    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePhoto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid photo id" });
    }

    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Photo not found" });

    // only uploader or admin can update
    if (existing.uploadedById !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, description, imageUrl } = req.body;

    // pasiruošiam dalinį update – tik tai, kas atėjo
    const data = {};

    if (typeof title !== "undefined") {
      data.title = title;
    }

    if (typeof description !== "undefined") {
      data.description = description;
    }

    if (typeof imageUrl !== "undefined") {
      // jei frontend siunčia naują URL – validuojam
      if (imageUrl) {
        try {
          new URL(imageUrl);
        } catch {
          return res.status(422).json({ error: "Invalid image URL" });
        }
      }
      data.imageUrl = imageUrl; // ČIA SVARBIAUSIA EILUTĖ
    }

    const updated = await prisma.photo.update({
      where: { id },
      data,
    });

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};


export const deletePhoto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid photo id" });
    }

    const existing = await prisma.photo.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // uploader or admin can delete
    if (existing.uploadedById !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // PIRMIAUSIA ištrinam komentarus, tada nuotrauką – vienoje transakcijoje
    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: { photoId: id },
      }),
      prisma.photo.delete({
        where: { id },
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("deletePhoto error", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPhotoComments = async (req, res) => {
  try {
    const photoId = Number(req.params.id);
    const comments = await prisma.comment.findMany({ where: { photoId }, include: { user: { select: { id: true, name: true } } } });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
