import { eq } from "drizzle-orm";
import { activities, activityCache, activityResults, progress } from './db_schema';

import data from '../../assets/constants/activitydetails.json';

const initDatabase = async (db: any) => {
    const existingActivities = await db.select().from(activities);

    if (existingActivities.length === 0) {
        for (const activity of data) {
            await db.insert(activities).values({
                ID: activity.ID,
                Name: activity.Name,
                Course: activity.Course
            })
        }
    };
}

const renderUserData = async (db: any, userId: any) => {
    const [userProgress, userCache, userResults] = await Promise.all([
        db.select().from(progress).where(eq(progress.userId, userId)),
        db.select().from(activityCache).where(eq(activityCache.userId, userId)),
        db.select().from(activityResults).where(eq(activityResults.userId, userId))
    ])

    return { userProgress, userCache, userResults };
}

export {
    initDatabase, renderUserData
};

