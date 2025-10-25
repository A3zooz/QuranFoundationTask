import { isValidChapterId, Language } from "@quranjs/api";
import { db } from "../config/db.js";
import { quranApi } from "../config/quranapi.js";
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const versesUrl = `https://verses.quran.com`;

export const getAllSurahs = async (req, res) => {
    const response = await quranApi.chapters.findAll(
        {
            language: Language.ARABIC
        }
    );
    return res.status(200).json(response);

}

export const getSurahAudio = async (req, res) => {
    try {
        const surahNumber = req.params.surahNumber;
        const response = await quranApi.audio.findVerseRecitationsByChapter(surahNumber, "2");
        console.log('Mapped audio data count:', response);
        const audioFiles = response.audioFiles.map(item => ({
            verseNumber: item.verseKey.split(':')[1],
            audioUrl: `${versesUrl}/${item.url}`
        }));


        return res.status(200).json(audioFiles);
    } catch (error) {
        console.error('Error fetching audio:', error);
        return res.status(500).json({
            message: 'Error fetching audio',
            error: error.message
        });
    }
}

export const bookmarkVerse = (req, res) => {
    const userId = req.user.id;
    const { surahNumber, verseNumber } = req.body;
    db.run(
        `INSERT INTO bookmarks (user_id, surah, ayah) VALUES (?, ?, ?)`,
        [userId, surahNumber, verseNumber], async function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to bookmark verse", error: err.message });
            }
            return res.status(201).json({ message: "Verse bookmarked successfully" });
        }
    )
}

export const getBookmarkedVerses = (req, res) => {
    const userId = req.user.id;
    db.run(`SELECT surah, ayah FROM bookmarks WHERE user_id = ?`, [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Failed to retrieve bookmarks", error: err.message });
            }
            return res.status(200).json({ bookmarks: rows });
        }
    )

}

export const removeBookmark = (req, res) => {
    const userId = req.user.id;
    const { surahNumber, verseNumber } = req.body;
    db.run(
        `DELETE FROM bookmarks WHERE user_id = ? AND surah = ? AND ayah = ?`,
        [userId, surahNumber, verseNumber], async function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to remove bookmark", error: err.message });
            }
            return res.status(200).json({ message: "Bookmark removed successfully" });
        }
    )
}

export const favoriteSurah = (req, res) => {
    const userId = req.user.id;

    const { surahNumber } = req.body;
    db.run(
        `INSERT INTO favorites (user_id, surah) VALUES (?, ?)`,
        [userId, surahNumber], async function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to favorite surah", error: err.message });
            }
            return res.status(201).json({ message: "Surah favorited successfully" });
        }
    )
}

export const getFavoriteSurahs = (req, res) => {
    const userId = req.user.id;
            console.log(req.user.id, "user id");

    db.all(`SELECT * FROM favorites WHERE user_id = ?`, userId,
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Failed to retrieve favorite surahs", error: err.message });
            }
            console.log(rows);
            return res.status(200).json({ favorites: rows });
        }
    )
}

export const removeFavorite = (req, res) => {
    const userId = req.user.id;
    const { surahNumber } = req.body;
    db.run(
        `DELETE FROM favorites WHERE user_id = ? AND surah = ?`,
        [userId, surahNumber], async function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to remove favorite", error: err.message });
            }
            return res.status(200).json({ message: "Favorite removed successfully" });
        }
    )
}
