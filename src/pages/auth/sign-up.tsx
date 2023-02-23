import type { NextPage } from "next";
import Head from "next/head";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { api } from "../../utils/api";
import { useCallback } from "react";
import { loginSchema, type ILogin } from "../../utils/validators";
import { signIn } from "next-auth/react";
import { Button } from "@client/shared/ui/button";
import { Input } from "@client/shared/ui/input";

const SignUp: NextPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: registerUser } = api.auth.signup.useMutation();

  const onSubmit = useCallback(
    async (data: ILogin) => {
      try {
        const result = await registerUser(data);
        if (result.status === 201) {
          await signIn("credentials", {
            callbackUrl: "/account",
            email: data.email,
            password: data.password,
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [registerUser]
  );

  return (
    <>
      <Head>
        <title>Sign Up page</title>
        <meta name="description" content="Sign Up" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={clsx(
          "grid h-screen place-items-center",
          "bg-gradient-to-br from-navy-100 to-navy-200 font-rubik"
        )}
      >
        <form
          className="m-auto flex w-full max-w-xs flex-col gap-6 rounded-md bg-navy-50 p-6 pb-7 shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1
            className={clsx(
              "text-center font-nunito text-2xl font-semibold text-navy-700"
            )}
          >
            Sign Up
          </h1>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <fieldset className="relative">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="on"
                  {...field}
                  className={clsx(
                    errors.email && errors.email.message
                      ? "border-red-500 focus:border-red-400 focus-visible:ring-red-400"
                      : "border-navy-900 focus:border-navy-400 focus-visible:ring-navy-400"
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
                  className="mb-1.5 block text-xs font-medium text-gray-700"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="on"
                  {...field}
                  className={clsx(
                    errors.email && errors.email.message
                      ? "border-red-500 focus:border-red-400 focus-visible:ring-red-400"
                      : "border-navy-900 focus:border-navy-400 focus-visible:ring-navy-400"
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
          <Button className="mt-3" type="submit">
            Sign Up
          </Button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
