import { getUserID } from '@/backend/firebase/auth';
import { createContext, useContext, useState } from 'react';
import { renderUserData } from '../database/databaseServices';
import { useDatabase } from './DBContext';

const UserDataContext = createContext();

const useUserData = () => useContext(UserDataContext);

const UserDataProvider = ({ children }) => {
    const [progress, setProgress] = useState([]);    
    const [cache, setCache] = useState([]);    
    const [results, setResults] = useState([]);    

    return (
        <UserDataContext.Provider value={{progress, setProgress, cache, setCache, results, setResults, loadUser}}>
            {children}
        </UserDataContext.Provider>
    );
}

const loadUser = async () => {
    const { db } = useDatabase();
    const userID = getUserID();

    const data = await renderUserData(db, userID);

    setProgress(data.userProgress);
    setCache(data.userCache);
    setResults(data.userResults);
}

export {
    UserDataContext, UserDataProvider, useUserData
};

