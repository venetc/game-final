import { createCipheriv, createDecipheriv, type Encoding, randomBytes, scryptSync } from "node:crypto";

const DEFAULT_KEY = scryptSync("her", "morzha", 32);
const DEFAULT_ALGORITHM = "aes256";
const DEFAULT_ENCODING: Encoding = "base64";

export class Encrypter {
  static encrypt(rawText: string, cryptoKey?: string) {
    const key = cryptoKey ? scryptSync(cryptoKey.trim(), "salt", 32) : DEFAULT_KEY;
    const iv = randomBytes(16);

    const cipher = createCipheriv(DEFAULT_ALGORITHM, key, iv);

    const firstEncryption = cipher.update(rawText, "utf8", DEFAULT_ENCODING).trim();
    const secondEncryption = cipher.final(DEFAULT_ENCODING).trim();
    const finalEncryption = `${firstEncryption}${secondEncryption}`;
    const hexedIV = Buffer.from(iv).toString(DEFAULT_ENCODING);

    const mergedToken = `${finalEncryption}|${hexedIV}`;
    const resultBuffer = Buffer.from(mergedToken, "utf8");
    const result = resultBuffer.toString("base64url").trim();

    return result;
  }

  static decrypt(encryptedText: string, cryptoKey?: string) {
    const key = cryptoKey ? scryptSync(cryptoKey.trim(), "salt", 32) : DEFAULT_KEY;

    const encryptedTextBuffer = Buffer.from(`${encryptedText.trim()}`, "base64url");
    const tokenString = encryptedTextBuffer.toString("utf8").trim();
    const splittedToken = tokenString.split("|");

    const [ encrypted, hexedIV ] = splittedToken;

    if (!hexedIV || !encrypted) throw new Error("missing data");

    const iv = Buffer.from(hexedIV, DEFAULT_ENCODING);

    const decipher = createDecipheriv(DEFAULT_ALGORITHM, key, iv);

    const firstDecryption = decipher.update(encrypted, DEFAULT_ENCODING, "utf8").trim();
    const secondDecryption = decipher.final("utf8").trim();

    return `${firstDecryption}${secondDecryption}`;
  }
}
