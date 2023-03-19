import { Separator } from "@client/shared/ui/separator";
import { Prisma, Role, type User } from "@prisma/client";
import { clsx } from "clsx";
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { prisma } from "src/server/db";

type PaswordlessUser = Pick<
  User,
  "id" | "email" | "name" | "roleId" | "emailConfirmed" | "isApproved"
> & {
  createdAt: string;
  role: Role;
};

type SSP =
  | ({
      user?: PaswordlessUser;
      errorMessage: string;
      isError: boolean;
    } & { isError: true })
  | ({
      user: PaswordlessUser;
      errorMessage?: string;
      isError: boolean;
    } & { isError: false });

export const getServerSideProps: GetServerSideProps<SSP> = async (
  ctx: GetServerSidePropsContext
) => {
  const { query } = ctx;

  const tokenString = Array.isArray(query.token) ? query.token[0] : query.token;

  if (!tokenString) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const paswordlessUser = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    email: true,
    role: true,
    roleId: true,
    createdAt: true,
    isApproved: true,
    emailConfirmed: true,
  });

  const emailFromQuery = Buffer.from(tokenString, "base64url").toString("utf8");

  const user = await prisma.user.findFirst({
    where: { email: emailFromQuery },
    select: paswordlessUser,
  });

  if (!user) {
    return {
      props: {
        isError: true,
        errorMessage: `Не&nbsp;удалось найти пользователя с&nbsp;этим email. Скопируйте строку <span class="text-red-500">${tokenString}</span> и&nbsp;отправьте одному из&nbsp;разработчиков.`,
      },
    };
  }

  if (user && user.emailConfirmed) {
    return {
      props: {
        isError: true,
        errorMessage:
          "Этот email уже был подтвержден. Дождитесь подтверждения аккаунта одним из&nbsp;администраторов.",
      },
    };
  }

  /* TODO: Перенести патч поумнее */
  await prisma.user.update({
    where: { email: emailFromQuery },
    data: { emailConfirmed: true },
  });

  return {
    props: {
      isError: false,
      user: { ...user, createdAt: user.createdAt.toISOString() },
    },
  };
};

const VerificationPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { isError, errorMessage, user } = props;
  /* TODO: Добавить возможность указать имя, если все ок */
  return (
    <>
      <Head>
        <title>Подтверждение email</title>
        <meta name="Подтверждение email" content="Подтверждение email" />
      </Head>
      <div
        className={clsx(
          "grid h-screen place-items-center",
          "bg-gradient-to-br from-navy-100 to-navy-200 font-rubik"
        )}
      >
        {props && (
          <div className="m-auto flex h-full w-full max-w-sm flex-col justify-center rounded-none bg-navy-50 px-1 py-5 shadow-lg sm:h-auto sm:rounded-md sm:px-6 sm:py-7">
            <h1 className="mb-5 text-center font-nunito text-3xl font-semibold text-navy-900">
              {isError ? "Ошибка!" : "Email подтвержден!"}
            </h1>
            {isError ? (
              <p
                className="text-center font-fira font-normal leading-snug text-navy-700"
                dangerouslySetInnerHTML={{ __html: errorMessage }}
              />
            ) : (
              <>
                <p className="mb-3 text-center font-fira font-normal leading-snug text-navy-700">
                  Отлично! Осталось только дождаться подтверждения вашего
                  аккаунта одним из&nbsp;администраторов.
                </p>
                <div className="mb-3 border border-navy-200 text-center font-fira font-normal leading-snug text-navy-700">
                  {user.name && (
                    <p className="flex justify-between py-1.5 px-3 text-sm odd:bg-navy-100">
                      <span>Имя</span>
                      <span>{user.name}</span>
                    </p>
                  )}
                  <p className="flex justify-between py-1.5 px-3 text-sm odd:bg-navy-100">
                    <span>Почта</span>
                    <span>{user.email}</span>
                  </p>
                  <p className="flex justify-between py-1.5 px-3 text-sm odd:bg-navy-100">
                    <span>Роль</span>
                    <span>{user.role.name}</span>
                  </p>
                  <p className="flex justify-between py-1.5 px-3 text-sm odd:bg-navy-100">
                    <span>Дата регистрации</span>
                    <span>
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </p>
                </div>
                <p className="text-center font-fira font-normal leading-snug text-navy-700">
                  Максимальный срок рассмотрения заявок&nbsp;&mdash;{" "}
                  <i className="text-navy-500">30&nbsp;дней</i>.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VerificationPage;
