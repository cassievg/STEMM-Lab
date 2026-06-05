import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('stemm.db');

const initDatabase = async () => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            course TEXT NOT NULL
        )    
    `)
}

const renderUserData = async (userId: any) => {
    try {
        const userProgress = await db.getAllAsync(`
            SELECT *
            FROM progress
            WHERE userID = ?
        `, [userId]);

        const userCache = await db.getAllAsync(`
            SELECT *
            FROM activityCache
            WHERE userID = ?
        `, [userId]);

        const userResults = await db.getAllAsync(`
            SELECT *
            FROM activityResults
            WHERE userID = ?
        `, [userId]);

        return { userProgress, userCache, userResults };
    } catch (e) {
        console.log("Error:", e);

        return { 
            userProgress: [],
            userCache: [],
            userResults: [] 
        };
    }
}

const fetchProgress = async (userId: any) => {
    try {
        const res = await db.getAllAsync(`
            SELECT *
            FROM progress
            WHERE userID = ?
        `, [userId])

        return res;
    } catch (e) {
        console.log("Error:", e);
        return {res: []};
    }
}

const fetchCache = async (userId: any) => {
    try {
        const res = await db.getAllAsync(`
            SELECT *
            FROM activityCache
            WHERE userID = ?
        `, [userId])

        return res;
    } catch (e) {
        console.log("Error:", e);
        return {res: []};
    }
}

const fetchResults = async (userId: any) => {
    try {
        const res = await db.getAllAsync(`
            SELECT *
            FROM activityResults
            WHERE userID = ?
        `, [userId])

        return res;
    } catch (e) {
        console.log("Error:", e);
        return {res: []};
    }
}

export {
    db, fetchCache, fetchProgress, fetchResults, initDatabase, renderUserData
};

