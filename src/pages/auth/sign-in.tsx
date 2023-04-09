import { useZodForm } from "@client/shared/lib/utils";
import clsx from "clsx";
import { EyeOff, Eye, Loader2 } from "lucide-react";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import type { FC, SVGProps } from "react";
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { type IUserSighInSchema, userSighInSchema } from "src/utils/validators";
import { Input } from "@client/shared/ui/input";
import { Button } from "@client/shared/ui/button";
import { useRouter } from "next/router";
import Link from "next/link";

const SignIn: NextPage = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch: watchFormChange,
  } = useZodForm({
    schema: userSighInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
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

  const [isPassVisisble, setIsPassVisibility] = useState(false);
  const togglePassVisibility = () =>
    setIsPassVisibility((prevState) => !prevState);

  return (
    <>
      <Head>
        <title>Авторизация</title>
        <meta name="description" content="Sign In" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={clsx(
          "grid h-screen place-items-center",
          "bg-gradient-to-br from-navy-100 to-navy-200 font-rubik"
        )}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative m-auto flex h-full w-full max-w-xs flex-col justify-center gap-6 rounded-none bg-navy-50 px-3 py-4 shadow-lg sm:h-auto sm:rounded-md sm:px-6 sm:py-4 sm:pb-5"
        >
          <h1 className="mb-2 mt-1 text-center font-nunito text-3xl font-semibold text-navy-900">
            Авторизация
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
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="on"
                  disabled={isSubmitting}
                  {...field}
                  className={clsx(
                    (errors.email && errors.email.message) || apiError
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
                  Пароль *
                </label>

                <div className="relative block">
                  <Input
                    id="password"
                    type={isPassVisisble ? "text" : "password"}
                    autoComplete="on"
                    disabled={isSubmitting}
                    {...field}
                    className={clsx(
                      "pr-12",
                      (errors.password && errors.password.message) || apiError
                        ? "border-red-600 focus:border-red-400 focus-visible:ring-red-400"
                        : "border-navy-600 focus:border-navy-400 focus-visible:ring-navy-400"
                    )}
                  />
                  <DynamicIcon
                    isVisible={isPassVisisble}
                    onClick={togglePassVisibility}
                    strokeWidth={1}
                    className={clsx(
                      "absolute top-2/4 right-3 block h-5 -translate-y-2/4 cursor-pointer",
                      errors.password ? "text-red-400" : "text-navy-900"
                    )}
                  />
                </div>

                {errors.password && (
                  <p className="absolute -bottom-5 text-xs text-red-500">
                    {errors.password?.message}
                  </p>
                )}
              </fieldset>
            )}
          />

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Входим" : "Войти"}
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>

          <div className="-mt-2 flex justify-around">
            <Link
              className="font-fira text-xs text-navy-900 underline hover:text-navy-700"
              href="/auth/sign-up"
            >
              Нет аккаунта?
            </Link>

            <Link
              className="font-fira text-xs text-navy-900 underline hover:text-navy-700"
              href="/auth/sign-in"
            >
              Забыли пароль?
            </Link>
          </div>

          {apiError && (
            <p className="absolute left-2/4 top-[calc(100%+1rem)] w-[90%] -translate-x-1/2 text-center font-fira text-sm font-normal text-red-500">
              {apiError.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

const DynamicIcon: FC<{ isVisible: boolean } & SVGProps<SVGSVGElement>> = ({
  isVisible,
  ...rest
}) => (isVisible ? <EyeOff {...rest} /> : <Eye {...rest} />);

export default SignIn;
