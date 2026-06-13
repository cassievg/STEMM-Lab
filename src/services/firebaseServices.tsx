import { firestore } from "../../backend/firebase/config";
import { getActivityById } from "./databaseServices";

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

type ResultRow = {
    id: string,
    roomId: string,
    teamId: string,
    activityId: string,
    score: string,
    submitDate: string,
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

const submitResult = async (activityId: string, teamId: string, score: number, roomId: string | null) => {
    await firestore()
        .collection('results')
        .add({
            activityId: activityId,
            teamId: teamId,
            score: score,
            roomId: roomId ?? null,
            submitDate: new Date().toISOString()
        })
}

const resolveLdb = async (snapshot: any) => {
    const rows = await Promise.all(
        snapshot.docs.map(async (doc: any) => {
            const data = doc.data();
            const teamDoc = await firestore()
                .collection('teams')
                .doc(data.teamId)
                .get();
            const teamName = teamDoc.data()?.name ?? 'unknown';
            const discriminator = teamDoc.data()?.discriminator ?? '';

            return {
                teamName: `${teamName} #${discriminator}`,
                score: data.score
            }
        })
    )

    return rows.sort((a, b) => b.score - a.score);
}

const fetchLocalLdb = async (roomId: string, activityId: string) => {
    const snapshot = await firestore()
        .collection('results')
        .where('roomId', '==', roomId)
        .where('activityId', '==', activityId)
        .get();

    return resolveLdb(snapshot);
}

const fetchGlobalLdb = async (activityId: string) => {
    const snapshot = await firestore()
        .collection('results')
        .where('activityId', '==', activityId)
        .get();
    
    return resolveLdb(snapshot);
}

const fetchTeamHistory = async (teamId: string) => {
    const snapshot = await firestore()
        .collection('results')
        .where('teamId', '==', teamId)
        .get();

    if (snapshot.empty) return [];

    const history = await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const activityName = await getActivityById(data.activityId);

            const globalSnapshot = await firestore()
                .collection('results')
                .where('activityId', '==', data.activityId)
                .get();

            const globalScores = globalSnapshot.docs.map(d => d.data().score);
            const globalRank = globalScores.filter(s => s > data.score).length + 1;

            let localrank: number | null = null;
            if (data.roomId) {
                const localSnapshot = await firestore()
                    .collection('results')
                    .where('roomId', '==', data.roomId)
                    .where('activityId', '==', data.activityId)
                    .get();

                const localScores = localSnapshot.docs.map(d => d.data().score);
                localrank = localScores.filter(s => s > data.score).length + 1;
            }

            return {
                activityId: data.activityId,
                activityName: activityName ?? data.activityId,
                score: data.score,
                globalRank: globalRank,
                localRank: localrank,
                submitDate: data.submitDate
            }
        })
    )

    return history.sort((a, b) => new Date(b.submitDate).getTime() - new Date(a.submitDate).getTime())
}

const activityIsComplete = async (teamId: string, activityId: string) => {
    const snapshot = await firestore()
        .collection('results')
        .where('teamId', '==', teamId)
        .where('activityId', '==', activityId)
        .get();

    return !snapshot.empty
}

const hasLocal = async (teamId: string, activityId: string) => {
    const snapshot = await firestore()
        .collection('rooms')
        .where('teams', 'array-contains', teamId)
        .where('activityId', '==', activityId)
        .get();
    
    return !snapshot.empty;
}

const completeActivity = async (teamId: string, activityId: string, roomId: string | null, score: number) => {
    await firestore()
        .collection('results')
        .add({
            activityId: activityId,
            roomId: roomId ?? null,
            score: score,
            submitDate: new Date().toISOString(),
            teamId: teamId
        });
}

export {
    activityIsComplete, completeActivity, createRoom,
    createTeam,
    fetchGlobalLdb,
    fetchLocalLdb,
    fetchTeamHistory,
    getRoomByTeamAndActivity,
    getRoomTeamsNames,
    getTeamDetails, hasLocal, joinRoom,
    leaveRoom,
    submitResult
};

