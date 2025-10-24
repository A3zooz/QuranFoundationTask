import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
dotenv.config();

const dbPath = process.env.DB_PATH || './database.sqlite';

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database at', dbPath);
    }
})

export const initializeDatabase = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            surah INTEGER,
            ayah INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            surah INTEGER,
            ayah INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
};
