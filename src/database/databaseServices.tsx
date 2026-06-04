import { eq } from "drizzle-orm";
import { activities, activityCache, activityResults, progress } from './db_schema';

import { getUserID } from '@/backend/firebase/auth';
import data from '../../assets/constants/activitydetails.json';

const initDatabase = async (db: any) => {
    const existingActivities = await db.select().from(activities);

    if (existingActivities.length === 0) {
        for (const activity of data) {
            await db.insert(activities).values({
                id: activity.id,
                name: activity.name,
                course: activity.course
            })
        }
    };
}

const renderUserData = async (db: any) => {
    const userId = getUserID();

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

