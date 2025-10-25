import e from "express";
import { getAllSurahs } from "../controllers/surahController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = e.Router();

router.get('/surahs', authenticate, getAllSurahs);


export default router;