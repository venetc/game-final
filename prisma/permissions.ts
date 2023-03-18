import { type Prisma } from "@prisma/client";

const QUESTIONS_PERMISSIONS: Prisma.PermissionCreateInput[] = [
  { description: "Добавлять вопросы игры" },
  { description: "Подтверждать вопросы игры" },
  { description: "Редактировать вопросы игры" },
  { description: "Удалять вопросы игры" },
];

const CATEGORIES_PERMISSIONS: Prisma.PermissionCreateInput[] = [
  { description: "Добавлять категории игры" },
  { description: "Подтверждать категории игры" },
  { description: "Редактировать категории игры" },
  { description: "Удалять категории игры" },
];

const LOBBY_PERMISSIONS: Prisma.PermissionCreateInput[] = [
  { description: "Создавать игровое лобби" },
];

// TODO: Rename
const USER_PERMISSIONS: Prisma.PermissionCreateInput[] = [
  { description: "Подтверждать регистрацию пользователей" },
  { description: "Менять роль пользователей" },
  { description: "Удалять пользователей" },
];

export const PERMISSIONS_FOR_ADMIN = [
  ...USER_PERMISSIONS,
  ...QUESTIONS_PERMISSIONS,
  ...CATEGORIES_PERMISSIONS,
  ...LOBBY_PERMISSIONS,
];
export const PERMISSIONS_FOR_CONTENT_MANAGER = [
  ...QUESTIONS_PERMISSIONS,
  ...CATEGORIES_PERMISSIONS,
];
export const PERMISSIONS_FOR_GAME_MASTER = [...LOBBY_PERMISSIONS];
