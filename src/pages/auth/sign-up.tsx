import type { NextPage } from "next";
import Head from "next/head";
import { useForm, Controller, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { api } from "../../utils/api";
import { useCallback, useState } from "react";
// import { signIn } from "next-auth/react";
import { Button } from "@client/shared/ui/button";
import { Input } from "@client/shared/ui/input";
import { type ZodType } from "zod";
import { TRPCClientError } from "@trpc/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@client/shared/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@client/shared/ui/hover-card";

import { type IUserCreateSchema, userCreateSchema } from "src/utils/validators";
import { Info, Loader2 } from "lucide-react";
import { prisma } from "src/server/db";
import type { Permission, Role } from "@prisma/client";
import { Separator } from "@client/shared/ui/separator";

export const getStaticProps = async () => {
  const roles = await prisma.role.findMany({
    include: { permissions: true },
  });

  return {
    props: { roles },
  };
};

type SignUpPageProps = {
  roles: Array<Role & { permissions: Permission[] }>;
};

const SignUp: NextPage<SignUpPageProps> = ({ roles }) => {
  const {
    mutateAsync: createUser,
    isLoading,
    isSuccess,
  } = api.user.create.useMutation();

  const useZodForm = <Schema extends ZodType>(
    props: Omit<UseFormProps<Schema["_input"]>, "resolver"> & {
      schema: Schema;
    }
  ) => {
    const form = useForm<Schema["_input"]>({
      ...props,
      resolver: zodResolver(props.schema),
    });

    return form;
  };

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
    },
  });

  const [apiError, setApiError] = useState<{ message: string } | null>(null);

  watchFormChange(() => setApiError(null));

  const onSubmit = useCallback(
    async (data: IUserCreateSchema) => {
      try {
        setApiError(null);
        const { status } = await createUser(data);

        if (status === 201) {
          /* await signIn("credentials", {
            callbackUrl: "/account",
            email: data.email,
            password: data.password,
          }); */
        }
      } catch (err) {
        err instanceof TRPCClientError
          ? setApiError({ message: err.message })
          : setApiError({ message: `Непредвиденная ошибка` });
      }
    },
    [createUser]
  );

  return (
    <>
      <Head>
        <title>Регистрация</title>
        <meta name="description" content="Sign Up" />
      </Head>
      <div
        className={clsx(
          "grid h-screen place-items-center",
          "bg-gradient-to-br from-navy-100 to-navy-200 font-rubik"
        )}
      >
        {!isSuccess ? (
          <form
            className="relative m-auto flex h-full w-full max-w-xs flex-col justify-center gap-6 rounded-none bg-navy-50 px-3 py-4 shadow-lg sm:h-auto sm:rounded-md sm:px-6 sm:py-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="mb-2 mt-1 text-center font-nunito text-3xl font-semibold text-navy-900">
              Регистрация
            </h1>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <fieldset className="relative">
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-navy-800"
                  >
                    Email
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
                  {errors.email && (
                    <p className="absolute -bottom-5 text-xs text-red-500">
                      {errors.email?.message}
                    </p>
                  )}
                </fieldset>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <fieldset className="relative">
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-medium text-navy-800"
                  >
                    Пароль
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="on"
                    disabled={isLoading}
                    {...field}
                    className={clsx(
                      errors.password && errors.password.message
                        ? "border-red-600 focus:border-red-400 focus-visible:ring-red-400"
                        : "border-navy-600 focus:border-navy-400 focus-visible:ring-navy-400"
                    )}
                  />
                  {errors.password && (
                    <p className="absolute -bottom-5 text-xs text-red-500">
                      {errors.password?.message}
                    </p>
                  )}
                </fieldset>
              )}
            />

            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <fieldset className="relative">
                  <label
                    htmlFor="email"
                    className="mb-1.5 flex items-center text-xs font-medium text-navy-800"
                  >
                    Роль
                  </label>
                  <Select
                    onValueChange={(value) => field.onChange(+value)}
                    name={field.name}
                    value={field.value.toString()}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-navy-600 text-navy-900 focus:border-navy-400 focus-visible:ring-navy-400">
                      <SelectValue asChild>
                        <span>
                          {roles &&
                            roles.find((role) => role.id === field.value)?.name}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {roles &&
                        roles.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={role.id.toString()}
                            className="pr-24 font-rubik text-sm font-normal text-navy-900"
                          >
                            {role.name}
                            <HoverCard>
                              <HoverCardTrigger
                                className="absolute top-2 right-2"
                                asChild
                              >
                                <Info className="block h-4 w-auto cursor-pointer opacity-40" />
                              </HoverCardTrigger>
                              <HoverCardContent side="right">
                                <div className="text-sm">
                                  <span className="mb-2 block">
                                    Доступные действия:
                                  </span>
                                  <ul>
                                    {role.permissions.map(
                                      (permission, index, arr) => (
                                        <li
                                          key={permission.id}
                                          className={
                                            index !== arr.length - 1
                                              ? "mb-0.5"
                                              : ""
                                          }
                                        >
                                          -{" "}
                                          {permission.description?.toLowerCase()}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.roleId && (
                    <p className="absolute -bottom-5 text-xs text-red-500">
                      {errors.roleId?.message}
                    </p>
                  )}
                </fieldset>
              )}
            />

            <Button className="mt-3" disabled={isLoading} type="submit">
              {isLoading ? "Создаем" : "Создать аккаунт"}
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>

            <Separator />

            <p className="text-center text-sm font-normal leading-snug text-navy-600">
              Доступ к&nbsp;сервису будет предоставлен только после
              подтверждения одним из&nbsp;администраторов
            </p>

            {apiError && (
              <p className="absolute left-2/4 top-[calc(100%+1rem)] w-[90%] -translate-x-1/2 text-center font-fira text-sm font-normal text-red-500">
                {apiError.message}
              </p>
            )}
          </form>
        ) : (
          <div className="m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none bg-navy-50 px-1 py-5 shadow-lg sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
            <h1 className="mb-5 text-center font-nunito text-3xl font-semibold text-navy-900">
              Аккаунт создан!
            </h1>
            <p className="mb-3 text-center font-fira font-normal leading-snug text-navy-700">
              Подтвердите email перейдя по&nbsp;ссылке из&nbsp;письма,
              и&nbsp;дождитесь подтверждения аккаунта одним
              из&nbsp;администраторов.
            </p>
            <p className="text-center font-fira font-normal leading-snug text-navy-700">
              Максимальный срок рассмотрения заявок&nbsp;&mdash;{" "}
              <i className="text-navy-500">30&nbsp;дней</i>.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUp;
