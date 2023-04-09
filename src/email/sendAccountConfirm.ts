import ConfirmAccountEmail, {
  type ConfirmAccountPayload,
} from "./confirm-account-email";

export const sendAccountConfirm = async (
  confirmAccountPayload: ConfirmAccountPayload
) => {
  await new Promise((resolve, reject) => {
    try {
      const confirmAccountEmail = new ConfirmAccountEmail(
        confirmAccountPayload
      );
      resolve(confirmAccountEmail.sendEmail());
    } catch (e) {
      reject(console.error("AccountConfirm.sendEmail failed", e));
    }
  });
};
