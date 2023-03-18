import { BaseEmailHtml } from "../fragments/BaseEmailHtml";
import type { ConfirmAccountPayload } from "../confirm-account-email";

export const AccountConfirmEmail = ({
  confirmLink,
  user,
}: ConfirmAccountPayload) => {
  return (
    <BaseEmailHtml
      subject="Подтверждение создания аккаунта"
      callToAction=<a target="_blank" rel="noreferrer" href={confirmLink}>
        ССЫЛКА
      </a>
      subtitle="Письмо для подтверждения аккаунта"
      title="Ну здарова"
    >
      <p>
        <>Привет {`${user.name ?? user.email}`}</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px" }}>
        <>
          Ну короче кто-то зарегал на это мыло аккаунт в &quot;Своей игре&quot;
          и мыло надо подтвердить.
        </>
      </p>

      <div style={{ lineHeight: "6px" }}>
        <p style={{ fontWeight: 400, lineHeight: "24px" }}>
          <>Ну ты короче тыкни по ссылке внизу, дальше за тебя все сделают</>
        </p>
      </div>
    </BaseEmailHtml>
  );
};
