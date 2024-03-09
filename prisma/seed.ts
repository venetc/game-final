import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

import { PERMISSIONS_FOR_ADMIN, PERMISSIONS_FOR_CONTENT_MANAGER, PERMISSIONS_FOR_GAME_MASTER } from "../src/permissions";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.MASTER_ACCOUNT_PASSWORD || !process.env.MASTER_ACCOUNT_EMAIL || !process.env.MASTER_ACCOUNT_NAME)
    throw new Error("❌ Invalid master account credentials! Check .env file ❌");

  const password = await hash(process.env.MASTER_ACCOUNT_PASSWORD, { type: 1 });

  await prisma.$transaction([
    prisma.role.create({
      data: {
        name: "Администратор",
        users: {
          create: {
            email: process.env.MASTER_ACCOUNT_EMAIL,
            name: process.env.MASTER_ACCOUNT_NAME,
            emailConfirmed: true,
            isApproved: true,
            password,
          },
        },
        permissions: PERMISSIONS_FOR_ADMIN.map((p) => p.token),
      },
    }),

    prisma.role.create({
      data: {
        name: "Контент-менеджер",
        permissions: PERMISSIONS_FOR_CONTENT_MANAGER.map((p) => p.token),
      },
    }),

    prisma.role.create({
      data: {
        name: "Гейм-мастер",
        permissions: PERMISSIONS_FOR_GAME_MASTER.map((p) => p.token),
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
