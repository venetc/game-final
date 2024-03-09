import { env } from "src/env/server.mjs";

import type SendmailTransport from "nodemailer/lib/sendmail-transport";
import type SMTPConnection from "nodemailer/lib/smtp-connection";

function detectTransport():
  | SendmailTransport.Options
  | SMTPConnection.Options
  | string {
  const port = parseInt(env.SMTP_PORT);
  const transport = {
    host: env.SMTP_HOST,
    port,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
    secure: port === 465,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
    },
  };

  return transport;
}

export const serverConfig = {
  transport: detectTransport(),
  from: env.SMTP_USERNAME,
};
