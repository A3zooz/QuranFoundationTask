import e from "express";
import { bookmarkVerse, getSurahByNumber, getPageVerses, favoriteSurah, getAllSurahs, getBookmarkedVerses, getFavoriteSurahs, getSurahAudio, removeFavorite } from "../controllers/surahController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = e.Router();

router.get('/surahs', authenticate, getAllSurahs);
router.get('/favorites', authenticate, getFavoriteSurahs);
router.get('/page/:pageNumber', authenticate, getPageVerses);
router.get('/surahs/:surahNumber/audio', authenticate, getSurahAudio);
router.post('/bookmark', authenticate, bookmarkVerse);
router.get('/bookmarks', authenticate, getBookmarkedVerses);
router.post('/favorite', authenticate, favoriteSurah);
router.delete('/favorite', authenticate, removeFavorite);
router.get('/:surahNumber', authenticate, getSurahByNumber);


export default router;