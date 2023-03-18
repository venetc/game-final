import { renderEmail } from "./renderEmail";
import BaseEmail from "./base-email";
import { type User, type Role } from "@prisma/client";

type EmailUser = Pick<User, "email" | "name"> & { roleName: Role["name"] };

export type ConfirmAccountPayload = {
  language: string;
  user: EmailUser;
  confirmLink: string;
};

export default class ConfirmAccountEmail extends BaseEmail {
  confirmAccountPayload: ConfirmAccountPayload;

  constructor(confirmAccountPayload: ConfirmAccountPayload) {
    super();
    this.name = "CONFIRM_ACCOUNT_EMAIL";
    this.confirmAccountPayload = confirmAccountPayload;
  }

  protected getNodeMailerPayload(): Record<string, unknown> {
    return {
      to: `${
        this.confirmAccountPayload.user.name ??
        this.confirmAccountPayload.user.roleName
      } <${this.confirmAccountPayload.user.email}>`,
      from: `${"Jeopardy!"} <${this.getMailerOptions().from}>`,
      subject: "Подтверждение аккаунта",
      html: renderEmail("AccountConfirmEmail", this.confirmAccountPayload),
    };
  }
}
