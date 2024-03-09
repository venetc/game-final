import { type Role, type User } from "@prisma/client";

import BaseEmail from "./base-email";
import { renderEmail } from "./renderEmail";

type EmailUser = Pick<User, "email" | "name"> & { roleName: Role["name"] };

export type ConfirmAccountPayload = {
  language: string;
  user: EmailUser;
  link: string;
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
      to: `${this.confirmAccountPayload.user.name ?? this.confirmAccountPayload.user.roleName} <${this.confirmAccountPayload.user.email}>`,
      from: `${"Jeopardy!"} <${this.getMailerOptions().from}>`,
      subject: "Подтверждение аккаунта",
      html: renderEmail("AccountConfirmEmail", this.confirmAccountPayload),
    };
  }
}
