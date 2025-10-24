import e from "express";
import dotenv from "dotenv";
dotenv.config();
import { initializeDatabase } from "./config/db.js";

initializeDatabase();

const app = e();

app.get("/", (req, res) => {
    res.send("Hello from backend");
});

app.listen(3000, () => {
    console.log("Backend server is running on http://localhost:3000");
});