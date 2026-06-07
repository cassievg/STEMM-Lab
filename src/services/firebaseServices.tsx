import { firestore } from "../../backend/firebase/config";

type TeamRow = {
    id: string,
    hostId: string,
    discriminator: string,
    grade: string,
    members: string[],
    name: string,
}

type RoomRow = {
    id: string,
    code: string,
    activityId: string,
    createdAt: string,
    hostTeamId: string, 
    status: string,
    teams: string[]
}

const createTeam = async (name: string, members: string[], grade: string, discriminator: string) => {
    const docRef = await firestore()
        .collection('teams')
        .add({
            name: name,
            members: members,
            grade: grade,
            discriminator: discriminator
        });
    
    return docRef;
}

const getTeamDetails = async (teamId: string): Promise<TeamRow | null> => {
    const doc = await firestore()
        .collection('teams')
        .doc(teamId)
        .get();

    if (!doc.exists) return null;

    return {
        id: doc.id,
        ...doc.data()
    } as TeamRow;
}

const generateRoomCode = async (): Promise<string> => {
    const chars = 'QWERTYUIOPASDFGHJKLZXCVBNM123456789';
    let code = '';
    let isUnique = false;

    while (!isUnique) {
        code = Array.from({length: 4}, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');

        const existing = await firestore()
            .collection('rooms')
            .where('code', '==', code)
            .where('status', '==', 'open')
            .get();

        isUnique = existing.empty;
    }

    return code;
}

const createRoom = async (activityId: string, hostId: string) => {
    const code = await generateRoomCode();
    
    const docRef = await firestore()
    .collection('rooms')
    .add({
        code: code,
        activityId: activityId,
        createdAt: new Date().toISOString(),
        hostTeamId: hostId,
        status: 'open',
        teams: [hostId]
    });
    
    return docRef;
}

const joinRoom = async (code: string, activityId: string, teamId: string): Promise<string | null> => {
    const snapshot = await firestore()
        .collection('rooms')
        .where('code', '==', code)
        .where('activityId', '==', activityId)
        .get();

    if (snapshot.empty) {
        console.log("room not found.");
        return null;
    }

    const roomRef = snapshot.docs[0].ref;

    await roomRef.update({
        teams: firestore.FieldValue.arrayUnion(teamId)
    })

    return snapshot.docs[0].id;
}

const leaveRoom = async (roomId: string, teamId: string) => {
    const roomRef = firestore().collection('rooms').doc(roomId);
    const doc = await roomRef.get();

    if (!doc.exists) return;

    const teams: string[] = doc.data()?.teams ?? [];

    if (teams.length <= 1) {
        await roomRef.delete();
    } else {
        await roomRef.update({
            teams: firestore.FieldValue.arrayRemove(teamId)
        });
    }
}

const getRoomByTeamAndActivity = async (teamId: string, activityId: string) => {
    const snapshot = await firestore()
        .collection('rooms')
        .where('teams', 'array-contains', teamId)
        .where('activityId', '==', activityId)
        .where('status', '==', 'open')
        .get();

    if (snapshot.empty) return null;

    const match = snapshot.docs.find(doc => 
        doc.data().activityId === activityId &&
        doc.data().status === 'open'
    )

    if (!match) return null;

    return {
        id: match.id,
        ...match.data()
    } as RoomRow;
}

const getRoomTeamsNames = async (roomId: string): Promise<string[]> => {
    const doc = await firestore()
        .collection('rooms')
        .doc(roomId)
        .get();

    if (!doc.exists) return [];

    const teamIds: string[] = doc.data()?.teams ?? [];

    const teamDocs = await Promise.all(
        teamIds.map(id => firestore().collection('teams').doc(id).get())
    );

    return teamDocs.map(doc => {
        const data = doc.data();
        return data ? `${data.name} #${data.discriminator}` : 'Unknown Team';
    });
}

export { createRoom, createTeam, getRoomByTeamAndActivity, getRoomTeamsNames, getTeamDetails, joinRoom, leaveRoom };

