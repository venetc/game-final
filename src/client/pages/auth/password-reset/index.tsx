import clsx from "clsx";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";

import { useZodForm } from "@client/shared/lib/utils";
import { Button } from "@client/shared/ui/button";

import { Input } from "@client/shared/ui/input";
import { Separator } from "@client/shared/ui/separator";
import { api } from "@server/utils/api";
import { sendPasswordResetSchema } from "@server/utils/validators";

import type { ISendPasswordResetSchema } from "@server/utils/validators";

export const PasswordResetPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useZodForm({
    schema: sendPasswordResetSchema,
    defaultValues: { email: "" },
  });

  const session = useSession();
  const noSession = session.status === "loading" || session.status === "unauthenticated";

  const { mutateAsync, isLoading, isSuccess } = api.email.sendPasswordResetLink.useMutation();

  const onSubmit = useCallback(
    async (data: ISendPasswordResetSchema) => {
      try {
        const { email } = data;

        const { message } = await mutateAsync({ email });
        setApiResponseMessage({ message });
      } catch (err) {
        console.log(err);
      }
    },
    [mutateAsync]
  );

  const [apiResponseMessage, setApiResponseMessage] = useState<{ message: string } | null>(null);

  const router = useRouter();
  return !isSuccess ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-navy-50 relative m-auto flex h-full w-full flex-col justify-center gap-6 rounded-none px-6 py-6 shadow-md sm:h-auto sm:max-w-xs sm:rounded-md sm:px-6 sm:py-4"
    >
      <h1 className="text-navy-900 relative text-center font-nunito text-3xl font-semibold">Восстановление пароля</h1>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <fieldset className="relative">
            <label htmlFor="email" className="text-navy-800 mb-1.5 block text-xs font-medium">
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
            {errors.email && <p className="absolute -bottom-5 text-xs text-red-500">{errors.email?.message}</p>}
          </fieldset>
        )}
      />

      <div className="relative mb-3">
        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? "Отправляем" : "Отправить письмо"}
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>

        {noSession ? (
          <Link
            href="/auth/sign-in"
            className="text-navy-900 hover:text-navy-700 absolute top-full left-1/2 flex -translate-x-1/2 translate-y-2.5 content-center items-center font-fira text-xs underline"
          >
            <ArrowLeft className="mr-1" strokeWidth={1.5} size={16} /> Я вспомнил пароль
          </Link>
        ) : (
          <div
            onClick={() => router.back()}
            className="text-navy-900 hover:text-navy-700 mx-auto -mt-4 -mb-1 flex cursor-pointer content-center items-center font-fira text-xs underline"
          >
            <ArrowLeft className="mr-1" strokeWidth={1.5} size={16} />
            Назад
          </div>
        )}
      </div>

      <div>
        <Separator className="mb-3" />

        <p className="text-navy-600 text-center text-sm font-normal leading-snug">Для изменения пароля перейдите по&nbsp;ссылке из&nbsp;письма</p>
      </div>
    </form>
  ) : (
    <div className="bg-navy-50 relative m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none px-1 py-5 shadow-md sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
      <h1 className="text-navy-900 relative mb-6 text-center font-nunito text-3xl font-semibold">Отлично!</h1>
      <p className="text-navy-700 text-center font-fira font-normal leading-snug">{apiResponseMessage?.message}</p>
    </div>
  );
};
