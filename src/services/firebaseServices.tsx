import { firestore } from "../../backend/firebase/config";

type TeamRow = {
    id: string,
    hostId: string,
    discriminator: string,
    grade: string,
    members: string[],
    name: string,
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

export { createTeam, getTeamDetails };

