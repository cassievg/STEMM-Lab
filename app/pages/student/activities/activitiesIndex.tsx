import allActivities from '../../../../assets/constants/activitydetails.json';

const activities: Record<string, any> = Object.fromEntries(
    allActivities.map((activity: any) => [String(activity.id), activity])
);

export default activities;