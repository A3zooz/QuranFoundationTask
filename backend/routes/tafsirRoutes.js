import e from "express";
import { getAllTafsirs, getVerseTafsir } from "../controllers/tafsirController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = e.Router();

router.get('/tafsirs', authenticate, getAllTafsirs);
router.get('/tafsirs/:surahNumber/:verseNumber', authenticate, getVerseTafsir);

export default router;