import * as SQLite from 'expo-sqlite';
import activityList from '../../assets/constants/activitydetails.json';

let db: SQLite.SQLiteDatabase;

type ActivityRow = {
    id: string;
    name: string;
    course: string;
}

const initDatabase = async () => {
    db = await SQLite.openDatabaseAsync('stemm.db');

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            course TEXT NOT NULL
        )    
    `)

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS inbox (
            id TEXT PRIMARY KEY,
            author TEXT NOT NULL,
            recipient TEXT NOT NULL,
            body TEXT NOT NULL,
            date TEXT NOT NULL
        )    
    `)

    for (const activity of activityList) {
        await db.runAsync(`
            INSERT OR IGNORE INTO activities
            (id, name, course)
            VALUES (?, ?, ?)
        `, [activity.id, activity.name, activity.course])
    }
}

const fetchInbox = async (userId: any) => {
    try {
        const inbox = await db.getAllAsync(`
            SELECT *
            FROM activityResults
            WHERE userID = ?
        `, [userId]);

        return inbox;
    } catch (e) {
        console.log("Error:", e);
        return;
    }
}

const fetchActivities = async (): Promise<ActivityRow[]> => {
    try {
        return await db.getAllAsync(`
            SELECT *
            FROM activities
        `)
    } catch (e) {
        console.log("Error:", e);
        return [];
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
        return [];
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
        return [];
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
        return [];
    }
}

const fetchCourses = async (): Promise<string[]> => {
    try {
        const res = await db.getAllAsync<{ course: string }>(`
            SELECT DISTINCT course
            FROM activities
            ORDER BY course
        `)

        return res.map(c => c.course);
    } catch (e) {
        console.log("Error:", e);
        return [];
    }
} 

export {
    db,
    fetchActivities,
    fetchCache, fetchCourses, fetchInbox,
    fetchProgress,
    fetchResults,
    initDatabase,
    renderUserData
};

