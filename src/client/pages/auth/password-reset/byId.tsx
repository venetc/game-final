import { TRPCClientError } from "@trpc/client";
import { isBefore } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

import { useState, useCallback, useRef, useEffect, memo, useMemo } from "react";
import { Controller } from "react-hook-form";

import { useZodForm } from "@client/shared/lib/utils";
import { Button } from "@client/shared/ui/button";
import { PasswordInput } from "@client/shared/ui/password-input";
import { Separator } from "@client/shared/ui/separator";
import { api } from "@server/utils/api";
import { userPasswordChangeSchema } from "@server/utils/validators";

import type { IUserPasswordChangeSchema } from "@server/utils/validators";

export type PasswordResetPageProps = { id: string; expires: string };

export const PasswordResetPageById = (props: PasswordResetPageProps) => {
  const { expires, id } = props;

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch: watchFormChange,
  } = useZodForm({
    schema: userPasswordChangeSchema,
    defaultValues: {
      password: "",
      requestId: id,
      passwordConfirm: "",
    },
  });

  const { mutateAsync, isLoading, isSuccess } = api.user.changePassword.useMutation();
  const [apiErrorMessage, setApiErrorMessage] = useState<{ message: string } | null>(null);

  watchFormChange(() => setApiErrorMessage(null));

  const onSubmit = useCallback(
    async (data: IUserPasswordChangeSchema) => {
      try {
        const { password, passwordConfirm, requestId } = data;

        await mutateAsync({ password, passwordConfirm, requestId });
        await signOut({ redirect: false });
      } catch (err) {
        err instanceof TRPCClientError ? setApiErrorMessage({ message: err.message }) : setApiErrorMessage({ message: `Непредвиденная ошибка` });
      }
    },
    [mutateAsync]
  );

  const apiErrorRef = useRef<HTMLParagraphElement>(null);
  const scrollToError = () => {
    apiErrorRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToError, [apiErrorMessage]);

  const isExpired = useMemo(() => {
    return isBefore(new Date(expires), new Date());
  }, [expires]);

  if (isSuccess) return <SuccessPanel />;
  if (isExpired) return <ExpiredPanel />;

  return (
    <form
      className="bg-navy-50 relative m-auto flex h-full w-full flex-col justify-center gap-6 rounded-none px-6 py-6 shadow-md sm:h-auto sm:max-w-xs sm:rounded-md sm:px-6 sm:py-4 sm:pb-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-navy-900 mb-2 mt-1 text-center font-nunito text-3xl font-semibold">Изменение пароля</h1>

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <fieldset className="relative">
            <label htmlFor="password" className="text-navy-800 mb-1.5 block text-xs font-medium">
              Пароль
            </label>

            <div className="relative block">
              <PasswordInput id="password" isError={!!errors.password || !!apiErrorMessage} autoComplete="on" disabled={isLoading} {...field} />
            </div>

            {errors.password && <p className="absolute -bottom-5 text-xs text-red-500">{errors.password?.message}</p>}
          </fieldset>
        )}
      />

      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field }) => (
          <fieldset className="relative">
            <label htmlFor="passwordConfirm" className="text-navy-800 mb-1.5 block text-xs font-medium">
              Повторите пароль
            </label>

            <div className="relative block">
              <PasswordInput id="passwordConfirm" isError={!!errors.passwordConfirm || !!apiErrorMessage} autoComplete="on" disabled={isLoading} {...field} />
            </div>

            {errors.passwordConfirm && <p className="absolute -bottom-5 text-xs text-red-500">{errors.passwordConfirm?.message}</p>}
          </fieldset>
        )}
      />

      <Button className="w-full" disabled={isLoading} type="submit">
        {isLoading ? "Меняем" : "Поменять пароль"}
        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>

      <div>
        <Separator className="mb-3" />
        <p className="text-navy-600 text-center text-sm font-normal leading-snug">
          После смены пароля вы&nbsp;автоматически выйдете из&nbsp;этого аккаунта и&nbsp;вам будет повторно предложено пройти процедуру авторизации.
        </p>
      </div>

      {apiErrorMessage && (
        <p ref={apiErrorRef} className="absolute left-2/4 top-[calc(100%+1rem)] w-[90%] -translate-x-1/2 pb-3 text-center font-fira text-sm font-normal text-red-500">
          {apiErrorMessage.message}
        </p>
      )}
    </form>
  );
};

const SuccessPanel = memo(() => {
  const router = useRouter();
  return (
    <div className="bg-navy-50 m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none px-6 py-6 shadow-md sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
      <h1 className="text-navy-900 mb-5 text-center font-nunito text-3xl font-semibold">Пароль изменен</h1>
      <p className="text-navy-700 mb-5 text-center font-fira font-normal leading-snug">Перейдите на&nbsp;страницу авторизации и&nbsp;войдите, использую новый пароль.</p>
      <Button className="w-full" type="button" onClick={() => router.push("/auth/sign-in")}>
        Перейти
      </Button>
    </div>
  );
});

const ExpiredPanel = memo(() => {
  return (
    <div className="bg-navy-50 m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none px-1 py-5 shadow-md sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
      <h1 className="text-navy-900 mb-5 text-center font-nunito text-3xl font-semibold">Время вышло</h1>
      <p className="text-navy-700 text-center font-fira font-normal leading-snug">
        Время жизни ссылки истекло, вернитесь на&nbsp;страницу восстановления пароля и&nbsp;повторите процедуру.
      </p>
    </div>
  );
});

ExpiredPanel.displayName = "ErrorPanel";
SuccessPanel.displayName = "SuccessPanel";
