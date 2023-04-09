import { BaseEmailHtml } from "../fragments/BaseEmailHtml";
import type { ChangePasswordPayload } from "../change-password-email";

export const ChangePasswordEmail = ({ link, user }: ChangePasswordPayload) => {
  return (
    <BaseEmailHtml
      subject="Смена пароля аккаунта"
      callToAction=<a target="_blank" rel="noreferrer" href={link}>
        ССЫЛКА
      </a>
      subtitle="Письмо для смены пароля аккаунта"
      title="Ну здарова"
    >
      <p>
        <>Привет {`${user.name ?? user.email}`}</>
      </p>
      <p style={{ fontWeight: 400, lineHeight: "24px" }}>
        <>
          Кто-то хочет поменять твой пароль в &quot;своей игре&quot;. Если это
          не ты - тупа игнорируй это сообщение. Если затупил и сам забыл пароль
          - тыкай по ссылке ниже.
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
