import * as SQLite from 'expo-sqlite';
import activityList from '../../assets/constants/activitydetails.json';

let db: SQLite.SQLiteDatabase | null = null;
let dbReady: Promise<void>;

type ActivityRow = {
    id: string;
    name: string;
    course: string;
}

type Progress = {
    id: string,
    activityId: string,
    userId: string,
    status: string,
}

const initDatabase = async (database: SQLite.SQLiteDatabase) => {
    db = database;

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS activities (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            course TEXT NOT NULL
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

const getDb = (): SQLite.SQLiteDatabase => {
    if (!db) throw new Error('database not initialized');
    return db;
}

const fetchActivities = async (): Promise<ActivityRow[]> => {
    try {
        return await getDb().getAllAsync(`
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
        const userProgress = await getDb().getAllAsync(`
            SELECT *
            FROM progress
            WHERE userID = ?
        `, [userId]);

        const userCache = await getDb().getAllAsync(`
            SELECT *
            FROM activityCache
            WHERE userID = ?
        `, [userId]);

        const userResults = await getDb().getAllAsync(`
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

const fetchProgress = async (userId: any): Promise<Progress[]> => {
    try {
        return await getDb().getAllAsync(`
            SELECT *
            FROM progress
            WHERE userID = ?
        `, [userId])
    } catch (e) {
        console.log("Error:", e);
        return [];
    }
}

const fetchHistory = async (userId: any): Promise<Progress[]> => {
    try {
        return await getDb().getAllAsync(`
            SELECT *
            FROM progress
            WHERE userID = ? AND status = ?
        `, [userId, 'completed'])
    } catch (e) {
        console.log("Error:", e);
        return [];
    }
}

const fetchCache = async (userId: any) => {
    try {
        const res = await getDb().getAllAsync(`
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
        const res = await getDb().getAllAsync(`
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
        const res = await getDb().getAllAsync<{ course: string }>(`
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

const getActivityById = async (id: string) => {
    try {
        const res = await getDb().getFirstAsync<ActivityRow>(`
            SELECT *
            FROM activities
            WHERE id = ?
        `, [id])

        return res?.name;
    } catch (e) {
        console.log("Error:", e);
        return '';
    }
}

export {
    db,
    fetchActivities,
    fetchCache, fetchCourses, fetchHistory, fetchProgress,
    fetchResults, getActivityById, initDatabase,
    renderUserData
};

