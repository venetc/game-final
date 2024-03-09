import { z } from "zod";

import type { Role } from "@prisma/client";

export const permissionTokenSchema = z
  .string()
  .min(1)
  .refine((string) => string.split(".").filter((s) => s.trim().length).length === 2, { message: "Некорректный токен разрешения" });

export const permissionSchema = z.object({
  token: permissionTokenSchema,
  description: z.string().optional(),
});

export type PermissionToken = z.infer<typeof permissionTokenSchema>;
export type Permission = z.infer<typeof permissionSchema>;

const QUESTIONS_PERMISSIONS: Permission[] = [
  { token: "questions.add", description: "Добавлять вопросы игры" },
  { token: "questions.approve", description: "Подтверждать вопросы игры" },
  { token: "questions.edit", description: "Редактировать вопросы игры" },
  { token: "questions.delete", description: "Удалять вопросы игры" },
];

const CATEGORIES_PERMISSIONS: Permission[] = [
  { token: "categories.add", description: "Добавлять категории игры" },
  { token: "categories.approve", description: "Подтверждать категории игры" },
  { token: "categories.edit", description: "Редактировать категории игры" },
  { token: "categories.delete", description: "Удалять категории игры" },
];

const LOBBY_PERMISSIONS: Permission[] = [{ token: "lobbies.create", description: "Создавать игровое лобби" }];

// TODO: Rename
const USERS_PERMISSIONS: Permission[] = [
  { token: "users.approve", description: "Подтверждать регистрацию пользователей" },
  { token: "users.changeRole", description: "Менять роль пользователей" },
  { token: "users.delete", description: "Удалять пользователей" },
];

export const ALL_PERMISSIONS = [...USERS_PERMISSIONS, ...QUESTIONS_PERMISSIONS, ...CATEGORIES_PERMISSIONS, ...LOBBY_PERMISSIONS];
export const PERMISSIONS_FOR_ADMIN = [...USERS_PERMISSIONS, ...QUESTIONS_PERMISSIONS, ...CATEGORIES_PERMISSIONS, ...LOBBY_PERMISSIONS];
export const PERMISSIONS_FOR_CONTENT_MANAGER = [...QUESTIONS_PERMISSIONS, ...CATEGORIES_PERMISSIONS];
export const PERMISSIONS_FOR_GAME_MASTER = [...LOBBY_PERMISSIONS];

export const parseApiPermissions = (permissions: Role["permissions"]): Permission[] => {
  if (!permissions || typeof permissions !== "object" || !Array.isArray(permissions)) return [];

  const set = new Set(permissions);

  return ALL_PERMISSIONS.filter((permission) => set.delete(permission.token));
};
