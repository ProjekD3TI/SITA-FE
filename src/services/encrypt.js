import CryptoJS from "crypto-js";
import { getEnv } from "@/utils/env";

const getSecretKey = () => getEnv("VITE_ENCRYPTION_KEY", import.meta.env.VITE_ENCRYPTION_KEY);

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), getSecretKey()).toString();
};

export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, getSecretKey());
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
