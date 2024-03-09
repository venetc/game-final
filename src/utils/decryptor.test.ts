import { Encrypter } from "./decryptor";

describe("Encrypter module", () => {
  const email = "testing69@gmail.com";
  const encodedEmail = Encrypter.encrypt(email);
  const decodedEmail = Encrypter.decrypt(encodedEmail);

  test("Encoded email is a string", () => {
    expect(typeof encodedEmail).toBe("string");
  });
  test("Decoded email is a string", () => {
    expect(typeof decodedEmail).toBe("string");
  });
  test("Email encoded with key not equal to encoded without", () => {
    const withKey = Encrypter.encrypt(email, "hello");
    const withoutKey = Encrypter.encrypt(email);

    expect(withKey).not.toBe(withoutKey);
  });
  test("Decoding works with and w/o key", () => {
    const encryptedWithKey = Encrypter.encrypt(email, "hello");
    const encryptedWithoutKey = Encrypter.encrypt(email);

    const decryptedWithKey = Encrypter.decrypt(encryptedWithKey, "hello");
    const decryptedWithoutKey = Encrypter.decrypt(encryptedWithoutKey);

    expect(decryptedWithKey).toBe(decryptedWithoutKey);
  });
  test("Random key will throw", () => {
    expect(() => {
      Encrypter.decrypt(email, "KEK");
    }).toThrow();
  });
});
