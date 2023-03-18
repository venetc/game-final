import { Permission, PrismaClient, type Prisma } from "@prisma/client";
import { hash } from "argon2";
import {
  PERMISSIONS_FOR_ADMIN,
  PERMISSIONS_FOR_CONTENT_MANAGER,
  PERMISSIONS_FOR_GAME_MASTER,
} from "./permissions";

const prisma = new PrismaClient();

async function main() {
  if (
    !process.env.MASTER_ACCOUNT_PASSWORD ||
    !process.env.MASTER_ACCOUNT_EMAIL ||
    !process.env.MASTER_ACCOUNT_NAME
  )
    throw new Error(
      "❌ Invalid master account credentials! Check .env file ❌"
    );

  const password = await hash(process.env.MASTER_ACCOUNT_PASSWORD, { type: 1 });

  const allPermissionsFromDB = await prisma.$transaction(
    PERMISSIONS_FOR_ADMIN.map((permission) => {
      return prisma.permission.create({ data: permission });
    })
  );

  const CMPermissionsFromDB = allPermissionsFromDB.filter((permission) => {
    return PERMISSIONS_FOR_CONTENT_MANAGER.some((cmPermission) => {
      return cmPermission.description === permission.description;
    });
  });

  const GMPermissionsFromDB = allPermissionsFromDB.filter((permission) => {
    return PERMISSIONS_FOR_GAME_MASTER.some((gmPermission) => {
      return gmPermission.description === permission.description;
    });
  });

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
        permissions: {
          connect: [
            ...allPermissionsFromDB.map((permission) => ({
              id: permission.id,
            })),
          ],
        },
      },
    }),

    prisma.role.create({
      data: {
        name: "Контент-менеджер",
        permissions: {
          connect: [
            ...CMPermissionsFromDB.map((permission) => ({
              id: permission.id,
            })),
          ],
        },
      },
    }),

    prisma.role.create({
      data: {
        name: "Гейм-мастер",
        permissions: {
          connect: [
            ...GMPermissionsFromDB.map((permission) => ({
              id: permission.id,
            })),
          ],
        },
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
