import e from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { initializeDatabase } from "./config/db.js";
import authRouter from './routes/authRoutes.js'
import surahRouter from './routes/surahRoutes.js'
import tafsirRouter from './routes/tafsirRoutes.js'
import { quranApi } from "./config/quranapi.js";

initializeDatabase();

const app = e();
app.use(cors());
app.use(e.json());
app.use('/api/auth', authRouter);
app.use('/api/surah', surahRouter);
app.use('/api/tafsir', tafsirRouter);



app.get("/api", (req, res) => {
    res.send("Hello from backend");
});
const response = await quranApi.verses.findByPage('1', {
    fields: {
        textUthmani: true,
        imageUrl: true,
        imageWidth: true
    }
});
console.log('Sample Quran API response for page 1:', response);


app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server is running on port ${process.env.PORT || 5000}`);
});