import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const member = await prisma.user.create({
    data: { name: "Narys", email: "member@test.com", password: "memberpass", role: "member" },
  });
  const admin = await prisma.user.create({
    data: { name: "Admin", email: "admin@test.com", password: "adminpass", role: "admin" },
  });

  // Albumai
  const album1 = await prisma.album.create({ data: { title: "Mieli kačiukai", userId: member.id } });
  const album2 = await prisma.album.create({ data: { title: "Juodi kačiukai", userId: member.id } });
  const album3 = await prisma.album.create({ data: { title: "Admin albumas", userId: admin.id } });

  // Nuotraukos
  const photo1 = await prisma.photo.create({ data: { title: "Katė 1", imageUrl: "url1", albumId: album1.id, uploadedById: member.id } });
  const photo2 = await prisma.photo.create({ data: { title: "Katė 2", imageUrl: "url2", albumId: album1.id, uploadedById: member.id } });
  const photo3 = await prisma.photo.create({ data: { title: "Katė 3", imageUrl: "url3", albumId: album2.id, uploadedById: member.id } });
  const photo4 = await prisma.photo.create({ data: { title: "Katė 4", imageUrl: "url4", albumId: album2.id, uploadedById: member.id } });
  const photo5 = await prisma.photo.create({ data: { title: "Katė 5", imageUrl: "url5", albumId: album3.id, uploadedById: admin.id } });

  // Komentarai
  await prisma.comment.create({ data: { content: "Labai miela!", userId: admin.id, photoId: photo1.id } });
  await prisma.comment.create({ data: { content: "Patinka!", userId: member.id, photoId: photo5.id } });
  await prisma.comment.create({ data: { content: "Aš noriu tokio!", userId: member.id, photoId: photo4.id } });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
