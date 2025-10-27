import e from "express";
import { bookmarkVerse, getSurahByNumber, getPageVerses, favoriteSurah, getAllSurahs, getBookmarkedVerses, getFavoriteSurahs, getSurahAudio, removeFavorite } from "../controllers/surahController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = e.Router();

router.get('/surahs', authenticate, getAllSurahs);
router.get('/:surahNumber', authenticate, getSurahByNumber);
router.get('/surahs/:surahNumber/audio', authenticate, getSurahAudio);
router.get('/page/:pageNumber', authenticate, getPageVerses);
router.post('/bookmark', authenticate, bookmarkVerse);
router.get('/bookmarks', authenticate, getBookmarkedVerses);
router.post('/favorite', authenticate, favoriteSurah);
router.get('/favorites', authenticate, getFavoriteSurahs);
router.delete('/favorite', authenticate, removeFavorite);


export default router;