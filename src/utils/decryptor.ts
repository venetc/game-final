import * as crypto from "crypto";

export class Encrypter {
  static algorithm = "aes256";
  static key = crypto.scryptSync("<Your-Secret-Key>", "salt", 32);

  static encrypt(clearText: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      Encrypter.algorithm,
      Encrypter.key,
      iv
    );
    const encrypted = cipher.update(clearText, "utf8", "hex");
    return Buffer.from(
      `${encrypted + cipher.final("hex")}|${Buffer.from(iv).toString("hex")}`,
      "utf8"
    ).toString("base64url");
  }

  static decrypt(encryptedText: string) {
    const [encrypted, iv] = Buffer.from(`${encryptedText}`, "base64url")
      .toString("utf8")
      .split("|");

    if (!iv) throw new Error("IV not found");
    if (!encrypted) throw new Error("Encrypted email not found");

    const decipher = crypto.createDecipheriv(
      Encrypter.algorithm,
      Encrypter.key,
      Buffer.from(iv, "hex")
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}
