import { renderEmail } from "./renderEmail";
import BaseEmail from "./base-email";
import { type User, type Role } from "@prisma/client";

type EmailUser = Pick<User, "email" | "name"> & { roleName: Role["name"] };

export type ChangePasswordPayload = {
  language: string;
  user: EmailUser;
  link: string;
};

export default class ChangePasswordEmail extends BaseEmail {
  changePasswordPayload: ChangePasswordPayload;

  constructor(changePasswordPayload: ChangePasswordPayload) {
    super();
    this.name = "CHANGE_PASSWORD_EMAIL";
    this.changePasswordPayload = changePasswordPayload;
  }

  protected getNodeMailerPayload(): Record<string, unknown> {
    return {
      to: `${
        this.changePasswordPayload.user.name ??
        this.changePasswordPayload.user.roleName
      } <${this.changePasswordPayload.user.email}>`,
      from: `${"Jeopardy!"} <${this.getMailerOptions().from}>`,
      subject: "Подтверждение аккаунта",
      html: renderEmail("ChangePasswordEmail", this.changePasswordPayload),
    };
  }
}
