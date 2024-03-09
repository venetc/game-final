import { signOut } from "next-auth/react";

import { Button } from "@client/shared/ui/button";

import type { JWT } from "next-auth/jwt";

export const NotificationPage = ({ token }: { token: JWT | null }) => {
  return (
    <>
      {token && (
        <div className="bg-navy-50 m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none px-6 py-5 shadow-md sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
          <h1 className="text-navy-900 mb-5 text-center font-nunito text-3xl font-semibold">{"Добро пожаловать"}</h1>
          {!token.emailConfirmed && (
            <p className="text-navy-700 text-center font-fira font-normal leading-snug">
              Чтобы получить доступ, необходимо подтвердить аккаунт, перейдя по&nbsp;ссылке из&nbsp;письма, и&nbsp;дождаться подтверждения одним из&nbsp;администраторов.
            </p>
          )}
          {token.emailConfirmed && !token.isApproved && (
            <p className="text-navy-700 text-center font-fira font-normal leading-snug">
              Чтобы получить доступ, необходимо дождаться подтверждения Вашего аккаунта одним из&nbsp;администраторов.
            </p>
          )}

          <Button className="mt-6" variant={"default"} onClick={() => signOut({ redirect: true, callbackUrl: "/auth/sign-in" })}>
            Выйти из аккаунта
          </Button>
        </div>
      )}
    </>
  );
};
