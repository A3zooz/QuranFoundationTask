import axios from "axios";
import { quranApi } from "../config/quranapi.js";
import dotenv from "dotenv";
dotenv.config();

const tafsirs = [14, 15, 16];

export const getVerseTafsir = async (req, res) => {
    try {
        const { surahNumber, verseNumber } = req.params;
        const ayahWithUthmaniText = await quranApi.verses.findByKey(`${surahNumber}:${verseNumber}`, {
            tafsirs: [...tafsirs],
            fields: {
                textUthmani: true,
            }
        });
        const tafsirData = {};
        await Promise.all(tafsirs.map(async tafsirId => {
            const response = await axios.get(`${process.env.API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${surahNumber}:${verseNumber}`, {
                headers: {
                    "x-auth-token": process.env.QURAN_CLIENT_SECRET,
                    Accept: "application/json",
                    "x-client-id": process.env.QURAN_CLIENT_ID
                }
            });
            tafsirData[tafsirId] = response.data;
        }));
        return res.status(200).json({
            verse: ayahWithUthmaniText,
            tafsirs: tafsirData
        });

    } catch (error) {
        console.error('Error getting verse tafsir', error);
        return res.status(500).json({
            message: "Error fetching verse tafsir",
            error: error.message
        })
    }
}

export const getAllTafsirs = async (req, res) => {
    try {
        const response = await quranApi.resources.findAllTafsirs();
        const tafsirsData = response.filter(tafsir => tafsirs.includes(tafsir.id));
        return res.status(200).json(tafsirsData);
    } catch (error) {
        console.error('error finding tafsirs', error);
        return res.status(500).json({
            message: 'Error fetching tafsir',
            error: error.message
        })
    }
}