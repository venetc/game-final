import type { Role, User } from "@prisma/client";

type PaswordlessUser = Pick<User, "id" | "email" | "name" | "roleId" | "emailConfirmed" | "isApproved"> & {
  createdAt: string;
  role: Role;
};

export type VerificationPageProps =
  | ({ user?: PaswordlessUser; errorMessage: string; isError: boolean } & { isError: true })
  | ({ user: PaswordlessUser; errorMessage?: string; isError: boolean } & { isError: false });

export const VerificationPage = (props: VerificationPageProps) => {
  const { isError, errorMessage, user } = props;
  /* TODO: Добавить возможность указать имя, если все ок */
  return (
    props && (
      <div className="bg-navy-50 m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none px-1 py-5 shadow-md sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
        <h1 className="text-navy-900 mb-5 text-center font-nunito text-3xl font-semibold">{isError ? "Ошибка!" : "Email подтвержден!"}</h1>
        {isError ? (
          <p className="text-navy-700 text-center font-fira font-normal leading-snug" dangerouslySetInnerHTML={{ __html: errorMessage }} />
        ) : (
          <>
            <p className="text-navy-700 text-center font-fira font-normal leading-snug">
              Отлично! Осталось только дождаться подтверждения вашего аккаунта одним из&nbsp;администраторов.
            </p>
            <div className="border-navy-200 text-navy-700 my-6 border text-center font-fira font-normal leading-snug">
              {user.name && (
                <p className="odd:bg-navy-100 flex justify-between py-1.5 px-3 text-sm">
                  <span>Имя</span>
                  <span>{user.name}</span>
                </p>
              )}
              <p className="odd:bg-navy-100 flex justify-between py-1.5 px-3 text-sm">
                <span>Почта</span>
                <span>{user.email}</span>
              </p>
              <p className="odd:bg-navy-100 flex justify-between py-1.5 px-3 text-sm">
                <span>Роль</span>
                <span>{user.role.name}</span>
              </p>
              <p className="odd:bg-navy-100 flex justify-between py-1.5 px-3 text-sm">
                <span>Дата регистрации</span>
                <span>{new Date(user.createdAt).toLocaleDateString("ru-RU")}</span>
              </p>
            </div>
            <p className="text-navy-700 text-center font-fira font-normal leading-snug">
              Максимальный срок рассмотрения заявок&nbsp;&mdash; <i className="text-navy-500">30&nbsp;дней</i>.
            </p>
          </>
        )}
      </div>
    )
  );
};
