import { db } from "../config/db.js";
export const bookmarkVerse = (req, res) => {
    const userId = req.user.id;
    const {surahNumber, verseNumber} = req.body;
    db.run(
        `INSERT INTO bookmarks (user_id, surah_number, verse_number) VALUES (?, ?, ?)`,
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
    db.run(`SELECT surah_number, verse_number FROM bookmarks WHERE user_id = ?`, [userId],
        (err, rows) => {
            if(err) {
                return res.status(500).json({ message: "Failed to retrieve bookmarks", error: err.message });
            }
            return res.status(200).json({ bookmarks: rows });
        }
    )

}

export const removeBookmark = (req, res) => {
    const userId = req.user.id;
    const {surahNumber, verseNumber} = req.body;
    db.run(
        `DELETE FROM bookmarks WHERE user_id = ? AND surah_number = ? AND verse_number = ?`,
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
    const {surahNumber} = req.body;
    db.run(
        `INSERT INTO favorites (user_id, surah_number) VALUES (?, ?)`,
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
    db.run(`SELECT surah_number FROM favorites WHERE user_id = ?`, [userId],
        (err, rows) => {
            if(err) {
                return res.status(500).json({ message: "Failed to retrieve favorite surahs", error: err.message });
            }
            return res.status(200).json({ favorites: rows });
        }
    )
}

export const removeFavorite = (req, res) => {
    const userId = req.user.id;
    const {surahNumber} = req.body;
    db.run(
        `DELETE FROM favorites WHERE user_id = ? AND surah_number = ?`,
        [userId, surahNumber], async function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to remove favorite", error: err.message });
            }
            return res.status(200).json({ message: "Favorite removed successfully" });
        }
    )
}
