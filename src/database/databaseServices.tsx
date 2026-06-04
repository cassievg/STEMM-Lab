import { activities, activityCache, activityResults, progress } from './db_schema';

import cache from '../../assets/constants/activitycachedetails.json';
import data from '../../assets/constants/activitydetails.json';
import result from '../../assets/constants/activityresultdetails.json';
import progress_data from '../../assets/constants/progressdetails.json';

const initDatabase = async (db: any) => {
    const existingActivities = await db.select().from(activities);
    const existingActivityCache = await db.select().from(activityCache);
    const existingProgress = await db.select().from(progress);
    const existingResult = await db.select().from(activityResults);

    if (existingActivities.length === 0) {
        for (const activity of data) {
            await db.insert(activities).values({
                id: activity.id,
                name: activity.name,
                course: activity.course
            })
        }
    };

    if (existingActivityCache.length === 0) {
        for (const activityCache of cache) {
            await db.insert(activityCache).values({
                id: activityCache.id,
                activityId: activityCache.activityId,
                userId: activityCache.userId,
                cachedAnswers: activityCache.cachedAnswers,
            })
        }
    };

    if (existingProgress.length === 0) {
        for (const progresses of progress_data) {
            await db.insert(progresses).values({
                id: progresses.id,
                userId: progresses.userId,
                activityId: progresses.activityId,
                progress: progresses.progress,
                timeTaken: progresses.timeTaken,
                status: progresses.status
            })
        }
    };

    if (existingResult.length === 0) {
        for (const results of result) {
            await db.insert(results).values({
                id: results.id,
                userId: results.userId,
                activityId: results.activityId,
                grade: results.grade,
                dateOfGrading: results.dateOfGrading
            })
        }
    };

    

    

}

export {
    initDatabase
};

