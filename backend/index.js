import e from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { initializeDatabase } from "./config/db.js";
import authRouter from './routes/authRoutes.js'

initializeDatabase();

const app = e();
app.use(cors());
app.use(e.json());
app.use('/api/auth', authRouter);


app.get("/api", (req, res) => {
    res.send("Hello from backend");
});

app.listen(3000, () => {
    console.log("Backend server is running on http://localhost:3000");
});