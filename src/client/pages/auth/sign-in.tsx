import clsx from "clsx";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { useCallback, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";

import { useZodForm } from "@client/shared/lib/utils";
import { Button } from "@client/shared/ui/button";
import { Input } from "@client/shared/ui/input";
import { PasswordInput } from "@client/shared/ui/password-input";

import { type IUserSighInSchema, userSighInSchema } from "src/utils/validators";

export const SignInPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch: watchFormChange,
  } = useZodForm({
    schema: userSighInSchema,
    defaultValues: { email: "", password: "" },
  });

  const [apiError, setApiError] = useState<{ message: string } | null>(null);

  watchFormChange(() => setApiError(null));

  const router = useRouter();

  const onSubmit = useCallback(
    async (data: IUserSighInSchema) => {
      try {
        setApiError(null);

        const { email, password } = data;

        const response = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (response) {
          if (response.status !== 200) {
            response.error && setApiError({ message: response.error });
          } else {
            await router.push("/");
          }
        }
      } catch (err) {
        setApiError({ message: `Непредвиденная ошибка` });
      }
    },
    [router]
  );

  const apiErrorRef = useRef<HTMLParagraphElement>(null);
  const scrollToError = () => {
    apiErrorRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToError, [apiError]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-navy-50 relative m-auto flex h-full w-full flex-col justify-center gap-6 rounded-none px-6 py-6 shadow-md sm:h-auto sm:max-w-xs sm:rounded-md sm:px-6 sm:py-4 sm:pb-5"
    >
      <h1 className="text-navy-900 mb-2 mt-1 text-center font-nunito text-3xl font-semibold">Авторизация</h1>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <fieldset className="relative">
            <label htmlFor="email" className="text-navy-800 mb-1.5 block text-xs font-medium">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="on"
              disabled={isSubmitting}
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
            <label htmlFor="password" className="text-navy-800 mb-1.5 block text-xs font-medium">
              Пароль *
            </label>

            <div className="relative block">
              <PasswordInput id="password" isError={!!errors.password} autoComplete="on" disabled={isSubmitting} {...field} />
            </div>

            {errors.password && <p className="absolute -bottom-5 text-xs text-red-500">{errors.password?.message}</p>}
          </fieldset>
        )}
      />

      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Входим" : "Войти"}
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>

      <div className="-mt-2 flex justify-around">
        <Link className="text-navy-900 hover:text-navy-700 flex content-center items-center font-fira text-xs underline" href="/auth/sign-up">
          <ArrowLeft className="mr-1" strokeWidth={1.5} size={16} /> Нет аккаунта?
        </Link>

        <Link href="/auth/password-reset" className="text-navy-900 hover:text-navy-700 flex cursor-pointer content-center items-center font-fira text-xs underline">
          Забыли пароль? <ArrowRight className="ml-1" strokeWidth={1.5} size={16} />
        </Link>
      </div>

      {apiError && (
        <p ref={apiErrorRef} className="absolute left-2/4 top-[calc(100%+1rem)] w-[90%] -translate-x-1/2 pb-3 text-center font-fira text-sm font-normal text-red-500">
          {apiError.message}
        </p>
      )}
    </form>
  );
};
