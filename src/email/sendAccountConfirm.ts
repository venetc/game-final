import ConfirmAccountEmail, {
  type ConfirmAccountPayload,
} from "./confirm-account-email";

export const sendAccountConfirm = async (
  confirmAccountPayload: ConfirmAccountPayload
) => {
  await new Promise((resolve, reject) => {
    try {
      const passwordResetEmail = new ConfirmAccountEmail(confirmAccountPayload);
      resolve(passwordResetEmail.sendEmail());
    } catch (e) {
      reject(
        console.error("OrganizerPaymentRefundFailedEmail.sendEmail failed", e)
      );
    }
  });
};
