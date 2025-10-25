import { Language, QuranClient } from "@quranjs/api";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.QURAN_CLIENT_ID)
console.log(process.env.QURAN_CLIENT_SECRET)

export const quranApi = new QuranClient({
    clientId: process.env.QURAN_CLIENT_ID,
    clientSecret: process.env.QURAN_CLIENT_SECRET,
    defaults: {
        language: Language.ARABIC
    }
});