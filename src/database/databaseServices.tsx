import { useDatabase } from '../context/DBContext';
import { activities } from './db_schema';

import data from '../../assets/constants/activitydetails.json';

const initDatabase = async () => {
    const { db } = useDatabase();

    const existingActivities = await db.select().from(activities);

    if (existingActivities.length == 0) {
        for (const activity of data) {
            await db.insert(activities).values({
                id: activity.id,
                name: activity.name,
                course: activity.course
            })
        }
    }

    

}

export {
    initDatabase
};

