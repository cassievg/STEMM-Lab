import { firestore } from "./config";

type InboxRow = {
    id: string,
    activityId: string,
    author: string,
    date: string,
    recipient: string,
}

const fetchInboxByRecipient = async (recipientID: string): Promise<InboxRow[]> => {
    const snapshot = await firestore()
        .collection('inbox')
        .where('recipient', '==', recipientID)
        .get();

    const rows = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as InboxRow[];

    const senderUser = await Promise.all(
        rows.map(async (row) => {
            const userDoc = await firestore()
                .collection('users')
                .doc(row.author)
                .get();

            return {
                ...row,
                author: userDoc.data()?.username ?? row.author
            }
        })
    )

    return senderUser;
};

const checkUserInTeam = async (userId: string, activityId: string): Promise<boolean> => {
    const snapshot = await firestore()
        .collection('teams')
        .where('activityId', '==', activityId)
        .where('members', 'array-contains', userId)
        .get();

    return !snapshot.empty;
}

const leaveTeam = async (userId: string, activityId: string): Promise<void> => {
    const snapshot = await firestore()
        .collection('teams')
        .where('activityId', '==', activityId)
        .where('members', 'array-contains', userId)
        .get();
    
    
    if (snapshot.empty) return;

    const teamRef = snapshot.docs[0].ref;
    const members: string[] = snapshot.docs[0].data().members;

    if (members.length === 1) {
        await teamRef.delete();
    } else {
        await teamRef.update({
            members: firestore.FieldValue.arrayRemove(userId)
        })
    }
}

const acceptInvite = async (inviteId: string, activityId: string, authorId: string, recipientId: string) => {
    const existingTeam = await firestore()
        .collection('teams')
        .where('activityId', '==', activityId)
        .where('members', 'array-contains', authorId)
        .get();

    if (!existingTeam.empty) {
        await existingTeam.docs[0].ref.update({
            members: firestore.FieldValue.arrayUnion(recipientId)
        });
    } else {
        await firestore()
            .collection('teams')
            .add({
                activityId: activityId,
                members: [authorId, recipientId]
            })
    }

    await firestore()
        .collection('inbox')
        .doc(inviteId)
        .delete();
}

const declineInvite = async (inviteId: string) => {
    await firestore()
        .collection('inbox')
        .doc(inviteId)
        .delete();
}

const fetchUsernamesById = async (userIds: string[]): Promise<string[]> => {
    const users = userIds.map(
        id => firestore().collection('users').doc(id).get()
    );

    const docs = await Promise.all(users);

    return docs.map(doc => doc.data()?.username ?? 'unknown user');
}

const fetchTeamByActivity = async (activityId: string, userId: string): Promise<string[]> => {
    const snapshot = await firestore()
        .collection('teams')
        .where('activityId', '==', activityId)
        .where('members', 'array-contains', userId)
        .get();
    
    if (snapshot.empty) return [];

    const memberIds: string[] = snapshot.docs[0].data().members;

    return await fetchUsernamesById(memberIds);
}

export { acceptInvite, checkUserInTeam, declineInvite, fetchInboxByRecipient, fetchTeamByActivity, leaveTeam };

