import * as z from "zod";

export const userCreateSchema = z.object({
  email: z.string().describe("User email").trim().min(1, { message: "Поле не должно быть пустым" }).email({ message: "Проверьте правильность email" }),
  password: z.string().describe("User password").trim().min(4, { message: "Минимум 4 символа" }).max(24, { message: "Максимум 24 символа" }),
  roleId: z.number({ required_error: "Выберите роль" }).describe("Desired role id").int(),
  name: z.string().describe("User name").trim().max(50, { message: "Максимум 50 символа" }).optional(),
});

export const userSighInSchema = z.object({
  email: z.string().describe("User email").trim().min(1, { message: "Поле не должно быть пустым" }).email({ message: "Проверьте правильность email" }),
  password: z.string().describe("User password").trim().min(4, { message: "Минимум 4 символа" }).max(24, { message: "Максимум 24 символа" }),
});

export const userPasswordChangeSchema = z.object({
  password: z.string().describe("User password").trim().min(4, { message: "Минимум 4 символа" }).max(24, { message: "Максимум 24 символа" }),
  passwordConfirm: z.string().describe("Confirm user password").trim().min(4, { message: "Минимум 4 символа" }).max(24, { message: "Максимум 24 символа" }),
  requestId: z.string().describe("Confirm user password").trim().min(1, { message: "Не найден Id запроса" }),
});

export const sendPasswordResetSchema = z.object({
  email: z.string().describe("User email").trim().min(1, { message: "Поле не должно быть пустым" }).email({ message: "Проверьте правильность email" }),
});

export type IUserCreateSchema = z.infer<typeof userCreateSchema>;
export type IUserSighInSchema = z.infer<typeof userSighInSchema>;
export type ISendPasswordResetSchema = z.infer<typeof sendPasswordResetSchema>;
export type IUserPasswordChangeSchema = z.infer<typeof userPasswordChangeSchema>;
