import * as crypto from "crypto";

const DEFAULT_KEY = crypto.scryptSync("her", "morzha", 32);
const DEFAULT_ALGORITHM = "aes256";

export class Encrypter {
  static encrypt(rawText: string, cryptoKey?: string) {
    const iv = crypto.randomBytes(16);
    const key = cryptoKey ? crypto.scryptSync(cryptoKey, "salt", 32) : DEFAULT_KEY;

    const cipher = crypto.createCipheriv(DEFAULT_ALGORITHM, key, iv);

    const firstEncryption = cipher.update(rawText, "utf8", "hex");
    const secondEncryption = cipher.final("hex");
    const finalEncryption = `${firstEncryption}${secondEncryption}`;
    const hexedIV = Buffer.from(iv).toString("hex");

    const result = `${finalEncryption}|${hexedIV}`;

    return Buffer.from(result, "utf8").toString("base64url");
  }

  static decrypt(encryptedText: string, cryptoKey?: string) {
    const key = cryptoKey ? crypto.scryptSync(cryptoKey, "salt", 32) : DEFAULT_KEY;
    const encryptedTextBuffer = Buffer.from(`${encryptedText}`, "base64url");

    const [encrypted, iv] = encryptedTextBuffer.toString("utf8").split("|");

    if (!iv) throw new Error("IV not found");
    if (!encrypted) throw new Error("Encrypted text not found");

    const ivBuffer = Buffer.from(iv, "hex");

    const decipher = crypto.createDecipheriv(DEFAULT_ALGORITHM, key, ivBuffer);
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}
