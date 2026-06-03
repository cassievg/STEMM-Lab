import * as SQLite from 'expo-sqlite';

export const database = SQLite.openDatabaseSync('stemm.db');

export const initDatabase = async () => {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS activityData (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            courseName TEXT NOT NULL,
            activityName TEXT NOT NULL,
            progress INTEGER NOT NULL,
            score INTEGER NOT NULL,
            completionDate TEXT NOT NULL
        );
    `);
}