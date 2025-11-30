import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // jei naudoji bcryptjs – pakeisk į 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
  // IŠVALOM SENUS DUOMENIS, kad nebūtų šiukšlių iš testavimo
  await prisma.comment.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // --- SLAPTAŽODŽIAI (aiškumo dėlei) ---
  // Šitie plaintext skirti tik tau žinoti testavimui:
  // admin:   Admin123!
  // mantas:  Mantas123!
  // ieva:    Ieva123!
  // jonas:   Jonas123!
  // gabija:  Gabija123!

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const mantasPassword = await bcrypt.hash("Mantas123!", 10);
  const ievaPassword = await bcrypt.hash("Ieva123!", 10);
  const jonasPassword = await bcrypt.hash("Jonas123!", 10);
  const gabijaPassword = await bcrypt.hash("Gabija123!", 10);

  // --- VARTOTOJAI ---
  const admin = await prisma.user.create({
    data: {
      name: "Austė",
      email: "admin@kates.lt",
      password: adminPassword,
      role: "admin",
    },
  });

  const mantas = await prisma.user.create({
    data: {
      name: "Mantas",
      email: "mantas@kates.lt",
      password: mantasPassword,
      role: "member",
    },
  });

  const ieva = await prisma.user.create({
    data: {
      name: "Ieva",
      email: "ieva@kates.lt",
      password: ievaPassword,
      role: "member",
    },
  });

  const jonas = await prisma.user.create({
    data: {
      name: "Jonas",
      email: "jonas@kates.lt",
      password: jonasPassword,
      role: "member",
    },
  });

  const gabija = await prisma.user.create({
    data: {
      name: "Gabija",
      email: "gabija@kates.lt",
      password: gabijaPassword,
      role: "member",
    },
  });

  // --- ALBUMAI ---
  const album1 = await prisma.album.create({
    data: {
      title: "Sofos karalienės",
      description: "Dviejų tortoiseshell sesių kasdienybė ant sofos.",
      userId: ieva.id,
    },
  });

  const album2 = await prisma.album.create({
    data: {
      title: "Juodi ir rudi",
      description: "Juodi, rudi ir margi – visi truputį laukiniai.",
      userId: mantas.id,
    },
  });

  const album3 = await prisma.album.create({
    data: {
      title: "Priglausti iš prieglaudos",
      description: "Katinai, kurie anksčiau neturėjo namų, o dabar – pilnus dubenėlius.",
      userId: gabija.id,
    },
  });

  const album4 = await prisma.album.create({
    data: {
      title: "Lauko nuotykių gauja",
      description: "Lauko ir kiemo katukai, kurie mėgsta nuotykius.",
      userId: jonas.id,
    },
  });

  const album5 = await prisma.album.create({
    data: {
      title: "Maži kačiukai",
      description: "Mažos pūkuotos kulkos, kurios dar tik atranda pasaulį.",
      userId: admin.id,
    },
  });

  // --- FOTO (naudojam tavo pateiktus URL) ---

  // Albumas 1 – Sofos karalienės
  const photo1 = await prisma.photo.create({
    data: {
      title: "Rytinis tempimasis ant sofos",
      description: "Tortoiseshell katė Kivi po miego tempiasi ant mylimos sofos.",
      imageUrl:
        "https://i.pinimg.com/1200x/34/16/d0/3416d026e40aeebed1bcd46f343261af.jpg",
      albumId: album1.id,
      uploadedById: ieva.id,
    },
  });

  const photo2 = await prisma.photo.create({
    data: {
      title: "Dvi sesės laukia pusryčių",
      description: "Abi katės susėdusios prie virtuvės durų ir laukia maisto.",
      imageUrl:
        "https://i.pinimg.com/736x/af/90/b3/af90b3ed8bcbddd1a9afd92598fcf711.jpg",
      albumId: album1.id,
      uploadedById: ieva.id,
    },
  });

  const photo3 = await prisma.photo.create({
    data: {
      title: "Sofos kampo sargė",
      description: "Ji visada užima tą pačią vietą ant kampinės sofos.",
      imageUrl:
        "https://i.pinimg.com/736x/27/f6/f7/27f6f70ff6ad1fa65c58f6b52bc9857b.jpg",
      albumId: album1.id,
      uploadedById: mantas.id,
    },
  });

  const photo4 = await prisma.photo.create({
    data: {
      title: "Popietės drėmbas",
      description: "Gilus miegas su letenėlėmis ore.",
      imageUrl:
        "https://i.pinimg.com/736x/58/3a/42/583a426c84dbff9431691a54ffe38355.jpg",
      albumId: album1.id,
      uploadedById: ieva.id,
    },
  });

  // Albumas 2 – Juodi ir rudi
  const photo5 = await prisma.photo.create({
    data: {
      title: "Juodas šešėlis",
      description: "Juodas katinas žiūri pro langą ankstų rytą.",
      imageUrl:
        "https://i.pinimg.com/736x/d9/a0/50/d9a050e445dc39d9b3d7a54afbb090cc.jpg",
      albumId: album2.id,
      uploadedById: mantas.id,
    },
  });

  const photo6 = await prisma.photo.create({
    data: {
      title: "Rudas tinginys",
      description: "Rudas katinas išsitiesęs ant kilimo po ilgos žaidimų sesijos.",
      imageUrl:
        "https://i.pinimg.com/736x/a6/f2/a3/a6f2a3e1bad3f040e8525518b3613e8a.jpg",
      albumId: album2.id,
      uploadedById: mantas.id,
    },
  });

  const photo7 = await prisma.photo.create({
    data: {
      title: "Žaliaakių portretas",
      description: "Stiprus žvilgsnis tiesiai į kamerą.",
      imageUrl:
        "https://i.pinimg.com/736x/14/bb/a9/14bba9e12ca0ac2ff5d264a160f87044.jpg",
      albumId: album2.id,
      uploadedById: jonas.id,
    },
  });

  const photo8 = await prisma.photo.create({
    data: {
      title: "Palangės karalius",
      description: "Juodas katinas stebi praeivius nuo palangės.",
      imageUrl:
        "https://i.pinimg.com/736x/a9/9d/13/a99d13e02080ac70dd218005e25dc33e.jpg",
      albumId: album2.id,
      uploadedById: mantas.id,
    },
  });

  // Albumas 3 – Priglausti iš prieglaudos
  const photo9 = await prisma.photo.create({
    data: {
      title: "Pirmas vakaras naujuose namuose",
      description: "Dar truputį nedrąsus, bet jau ant sofkutės.",
      imageUrl:
        "https://i.pinimg.com/1200x/49/9d/1b/499d1bceed2fe8e9c85a0812418f8aba.jpg",
      albumId: album3.id,
      uploadedById: gabija.id,
    },
  });

  const photo10 = await prisma.photo.create({
    data: {
      title: "Pilkas priglaustukas",
      description: "Jis buvo pats tyliausias narvelyje, dabar – pats drąsiausias.",
      imageUrl:
        "https://i.pinimg.com/1200x/54/b7/89/54b789336d17acd8171326352e264624.jpg",
      albumId: album3.id,
      uploadedById: gabija.id,
    },
  });

  const photo11 = await prisma.photo.create({
    data: {
      title: "Gif'as iš pirmų žaidimų",
      description: "Trumpa animacija iš pirmos žaidimų sesijos su plunksna.",
      imageUrl:
        "https://kates.onrender.com/uploads/1764533715188_attachment.gif",
      albumId: album3.id,
      uploadedById: ieva.id,
    },
  });

  const photo12 = await prisma.photo.create({
    data: {
      title: "Drąsus žingsnis į lauką",
      description: "Pirmas bandymas išeiti į balkoną.",
      imageUrl:
        "https://i.pinimg.com/1200x/0a/0a/ca/0a0aca59045549cbc686adbaf593370a.jpg",
      albumId: album3.id,
      uploadedById: gabija.id,
    },
  });

  // Albumas 4 – Lauko nuotykių gauja
  const photo13 = await prisma.photo.create({
    data: {
      title: "Kiemo bosas",
      description: "Lauko katinas, kuris visada pasitinka prie laiptinės.",
      imageUrl:
        "https://i.pinimg.com/736x/9f/2c/06/9f2c06094be67e887601379599fa6cd2.jpg",
      albumId: album4.id,
      uploadedById: jonas.id,
    },
  });

  const photo14 = await prisma.photo.create({
    data: {
      title: "Šuolis per tvorą",
      description: "Pagautas tobulo momento ore.",
      imageUrl:
        "https://i.pinimg.com/736x/a9/45/d9/a945d9a6c3013a3e6c00dbb92e2cea8f.jpg",
      albumId: album4.id,
      uploadedById: jonas.id,
    },
  });

  const photo15 = await prisma.photo.create({
    data: {
      title: "Saulėlydis kieme",
      description: "Katinas nutūpęs ant tvorelės, fone – oranžinis dangus.",
      imageUrl:
        "https://i.pinimg.com/736x/f1/8a/ec/f18aec7c19a869984c3159c19d0ba1b2.jpg",
      albumId: album4.id,
      uploadedById: admin.id,
    },
  });

  // Albumas 5 – Maži kačiukai
  const photo16 = await prisma.photo.create({
    data: {
      title: "Pirmas pienas",
      description: "Mažas kačiukas prie dubenėlio pirmą kartą ragauja pieną.",
      imageUrl:
        "https://i.pinimg.com/736x/50/70/ef/5070ef1b0681ac78ab3cbba0f4d64cf6.jpg",
      albumId: album5.id,
      uploadedById: admin.id,
    },
  });

  const photo17 = await prisma.photo.create({
    data: {
      title: "Kačiukai eilėje",
      description: "Trys mažyliai gražiai susėdę eilute ir žiūri į kamerą.",
      imageUrl:
        "https://i.pinimg.com/736x/54/4b/a6/544ba600d88547b9aefea06c75d3e2ac.jpg",
      albumId: album5.id,
      uploadedById: admin.id,
    },
  });

  const photo18 = await prisma.photo.create({
    data: {
      title: "Miegas ant pledo",
      description: "Maža dryžuota katytė susirangiusi ant languoto pledo.",
      imageUrl:
        "https://i.pinimg.com/736x/da/04/14/da0414ed410ffebddf6c39a40d271b78.jpg",
      albumId: album5.id,
      uploadedById: ieva.id,
    },
  });

  // --- KOMENTARAI ---

  await prisma.comment.createMany({
    data: [
      // ant photo1
      {
        content: "Atrodo taip minkšta sofa, tobula vieta rytinei kavai.",
        userId: admin.id,
        photoId: photo1.id,
      },
      {
        content: "Tikra sofos karalienė 😻",
        userId: mantas.id,
        photoId: photo1.id,
      },
      {
        content: "Tas žvilgsnis daug pasako.",
        userId: jonas.id,
        photoId: photo1.id,
      },

      // photo2
      {
        content: "Labai primena mano Milę iš prieglaudos.",
        userId: gabija.id,
        photoId: photo2.id,
      },
      {
        content: "Ji visada taip įsitaiso, kai grįžtu iš darbo.",
        userId: ieva.id,
        photoId: photo2.id,
      },

      // photo3
      {
        content: "Gražios dėmės, tikras tortie charakteris.",
        userId: admin.id,
        photoId: photo3.id,
      },

      // photo4
      {
        content: "Man čia naujas mėgstamiausias katinas internete.",
        userId: mantas.id,
        photoId: photo4.id,
      },

      // photo5
      {
        content: "Juodi katinai yra tokie fotogeniški!",
        userId: ieva.id,
        photoId: photo5.id,
      },

      // photo6
      {
        content: "Toks rimtas žvilgsnis, lyg galvotų apie mokesčius.",
        userId: jonas.id,
        photoId: photo6.id,
      },

      // photo7
      {
        content: "Fantastiškos spalvos.",
        userId: gabija.id,
        photoId: photo7.id,
      },

      // photo8
      {
        content: "Šita nuotrauka verta atviruko.",
        userId: admin.id,
        photoId: photo8.id,
      },

      // photo9
      {
        content: "Smagu matyti priglaustus katinus tokius laimingus.",
        userId: mantas.id,
        photoId: photo9.id,
      },

      // photo10
      {
        content: "Už šitą žvilgsnį duočiau papildomų skanėstų.",
        userId: jonas.id,
        photoId: photo10.id,
      },

      // photo11
      {
        content: "Gif'as žudo, negaliu nustoti žiūrėti 😂",
        userId: ieva.id,
        photoId: photo11.id,
      },

      // photo12
      {
        content: "Mažyliams sekasi vis geriau kasdien.",
        userId: gabija.id,
        photoId: photo12.id,
      },

      // photo13
      {
        content: "Tikras kiemo bosas.",
        userId: admin.id,
        photoId: photo13.id,
      },

      // photo14
      {
        content: "Koks šuolis! Ar jis visada toks aktyvus?",
        userId: ieva.id,
        photoId: photo14.id,
      },

      // photo15
      {
        content: "Tokias nuotraukas norėčiau matyti kasdien savo feed'e.",
        userId: mantas.id,
        photoId: photo15.id,
      },
    ],
  });

  console.log("✅ Seed completed with realistic data.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
