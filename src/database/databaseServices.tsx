import * as SQLite from 'expo-sqlite';
import activityList from '../../assets/constants/activitydetails.json';

let db: SQLite.SQLiteDatabase;

const initDatabase = async () => {
    console.log("dasdasdasasdasdasdasdasdasdasdasd");
    db = await SQLite.openDatabaseAsync('stemm.db');

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            course TEXT NOT NULL
        )    
    `)

    console.log('getting activities')
    for (const activity of activityList) {
        console.log(activity.Name);
        await db.runAsync(`
            INSERT INTO activities
            (id, name, course)
            VALUES (?, ?, ?)
        `, [activity.ID, activity.Name, activity.Course])
    }
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

