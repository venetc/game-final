import ChangePasswordEmail, {
  type ChangePasswordPayload,
} from "./change-password-email";

export const sendPasswordReset = async (
  changePasswordPayload: ChangePasswordPayload
) => {
  await new Promise((resolve, reject) => {
    try {
      const passwordChangeEmail = new ChangePasswordEmail(
        changePasswordPayload
      );
      resolve(passwordChangeEmail.sendEmail());
    } catch (e) {
      reject(console.error("PasswordReset.sendEmail failed", e));
    }
  });
};
