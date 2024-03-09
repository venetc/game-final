import { TRPCClientError } from "@trpc/client";
import { clsx } from "clsx";
import { ArrowRight, Info, Loader2 } from "lucide-react";

import Link from "next/link";

import { memo, useEffect, useRef } from "react";
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";

import { useZodForm } from "@client/shared/lib/utils";
import { Button } from "@client/shared/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@client/shared/ui/hover-card";
import { Input } from "@client/shared/ui/input";
import { PasswordInput } from "@client/shared/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@client/shared/ui/select";
import { Separator } from "@client/shared/ui/separator";
import { api } from "@server/utils/api";
import { type IUserCreateSchema, userCreateSchema } from "@server/utils/validators";

import { parseApiPermissions } from "src/permissions";

import type { Role } from "@prisma/client";

type RolesProp = Role[];

type PageProps = { roles: RolesProp };

export const SignUpPage = ({ roles }: PageProps) => {
  const { mutateAsync: createUser, isLoading, status } = api.user.create.useMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch: watchFormChange,
  } = useZodForm({
    schema: userCreateSchema,
    defaultValues: {
      email: "",
      password: "",
      roleId: roles && roles[0]?.id,
      name: "",
    },
  });

  type ApiError = { message: string } | null;
  const [apiError, setApiError] = useState<ApiError>(null);

  watchFormChange(() => setApiError(null));

  const onSubmit = useCallback(
    async (data: IUserCreateSchema) => {
      try {
        setApiError(null);

        await createUser(data);
      } catch (err) {
        err instanceof TRPCClientError ? setApiError({ message: err.message }) : setApiError({ message: `Непредвиденная ошибка` });
      }
    },
    [createUser]
  );

  const apiErrorRef = useRef<HTMLParagraphElement>(null);
  const scrollToError = () => {
    apiErrorRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToError, [apiError]);

  return (
    <>
      {status !== "success" ? (
        <form
          className="relative m-auto flex h-full w-full flex-col justify-center gap-6 rounded-none bg-navy-50 px-6 py-6 shadow-md sm:h-auto sm:max-w-xs sm:rounded-md sm:px-6 sm:py-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="mb-2 mt-1 text-center font-nunito text-3xl font-semibold text-navy-900">Регистрация</h1>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <fieldset className="relative">
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-navy-800">
                  Имя
                </label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="on"
                  disabled={isLoading}
                  {...field}
                  className={clsx(
                    errors.name && errors.name.message
                      ? "border-red-600 focus:border-red-400 focus-visible:ring-red-400"
                      : "border-primary focus:border-navy-400 focus-visible:ring-navy-400"
                  )}
                />
                {errors.name && <p className="absolute -bottom-5 text-xs text-red-500">{errors.name?.message}</p>}
              </fieldset>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <fieldset className="relative">
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-navy-800">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="on"
                  disabled={isLoading}
                  {...field}
                  className={clsx(
                    errors.email && errors.email.message
                      ? "border-red-600 focus:border-red-400 focus-visible:ring-red-400"
                      : "border-navy-600 focus:border-navy-400 focus-visible:ring-navy-400"
                  )}
                />
                {errors.email && <p className="absolute -bottom-5 text-xs text-red-500">{errors.email?.message}</p>}
              </fieldset>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <fieldset className="relative">
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-navy-800">
                  Пароль *
                </label>

                <div className="relative block">
                  <PasswordInput id="password" isError={!!errors.password} autoComplete="on" disabled={isLoading} {...field} />
                </div>

                {errors.password && <p className="absolute -bottom-5 text-xs text-red-500">{errors.password?.message}</p>}
              </fieldset>
            )}
          />

          <Controller
            name="roleId"
            control={control}
            render={({ field }) => (
              <fieldset className="relative">
                <label htmlFor="email" className="mb-1.5 flex items-center text-xs font-medium text-navy-800">
                  Роль
                </label>
                <Select onValueChange={(value) => field.onChange(+value)} name={field.name} value={field.value.toString()} disabled={isLoading}>
                  <SelectTrigger className="border-navy-600 text-navy-900 focus:border-navy-400 focus-visible:ring-navy-400">
                    <SelectValue asChild>
                      <span>{roles && roles.find((role) => role.id === field.value)?.name}</span>
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent position="popper" sideOffset={2}>
                    {roles &&
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()} className="pr-24 font-rubik text-sm font-normal text-navy-900">
                          {role.name}
                          {parseApiPermissions(role.permissions).length && (
                            <HoverCard openDelay={300}>
                              <HoverCardTrigger className="absolute top-2 right-2" asChild>
                                <Info className="block h-4 w-auto cursor-pointer opacity-40" />
                              </HoverCardTrigger>

                              <HoverCardContent side="right">
                                <div className="text-sm">
                                  <span className="mb-2 block">Доступные действия:</span>
                                  <ul>
                                    {parseApiPermissions(role.permissions).map((permission, index, arr) => (
                                      <li key={permission.token} className={index !== arr.length - 1 ? "mb-0.5" : ""}>
                                        - {permission.description}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.roleId && <p className="absolute -bottom-5 text-xs text-red-500">{errors.roleId?.message}</p>}
              </fieldset>
            )}
          />

          <div className="relative mt-3 mb-3">
            <Button className="w-full font-nunito" disabled={isLoading} type="submit">
              {isLoading ? "Создаем" : "Создать аккаунт"}
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
            <Link
              className="absolute top-full left-1/2 flex -translate-x-1/2 translate-y-2.5 content-center items-center font-fira text-xs text-navy-900 underline hover:text-navy-700"
              href="/auth/sign-in"
            >
              Уже есть аккаунт? <ArrowRight className="ml-1" strokeWidth={1.5} size={16} />
            </Link>
          </div>

          <div>
            <Separator className="mb-3" />

            <p className="text-center text-sm font-normal leading-snug text-navy-600">
              Доступ к&nbsp;сервису будет предоставлен только после подтверждения одним из&nbsp;администраторов
            </p>
          </div>

          {apiError && (
            <p ref={apiErrorRef} className="absolute left-2/4 top-[calc(100%+1rem)] w-[90%] -translate-x-1/2 pb-3 text-center font-fira text-sm font-normal text-red-500">
              {apiError.message}
            </p>
          )}
        </form>
      ) : (
        <SuccessPanel />
      )}
    </>
  );
};

const SuccessPanel = memo(() => {
  return (
    <div className="m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none bg-navy-50 px-1 py-5 shadow-md sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
      <h1 className="mb-5 text-center font-nunito text-3xl font-semibold text-navy-900">Аккаунт создан!</h1>
      <p className="mb-3 text-center font-fira font-normal leading-snug text-navy-700">
        Подтвердите email перейдя по&nbsp;ссылке из&nbsp;письма, и&nbsp;дождитесь подтверждения аккаунта одним из&nbsp;администраторов.
      </p>
      <p className="text-center font-fira font-normal leading-snug text-navy-700">
        Максимальный срок рассмотрения заявок&nbsp;&mdash; <i className="text-navy-500">30&nbsp;дней</i>.
      </p>
    </div>
  );
});

SuccessPanel.displayName = "SuccessPanel";
