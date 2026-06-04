import { createContext, useContext, useState } from 'react';
import { renderUserData } from '../database/databaseServices';
import { useAuth } from './AuthContext';
import { useDatabase } from './DBContext';

const UserDataContext = createContext();

const useUserData = () => useContext(UserDataContext);

const UserDataProvider = ({ children }) => {
    const { currentUser, userId } = useAuth();
    const { db } = useDatabase();
    
    const [progress, setProgress] = useState([]);    
    const [cache, setCache] = useState([]);    
    const [results, setResults] = useState([]);

    const loadUser = async () => {
        if (!currentUser || !userId) return;

        const data = await renderUserData(db, userId);

        setProgress(data.userProgress);
        setCache(data.userCache);
        setResults(data.userResults);
    };

    return (
        <UserDataContext.Provider value={{progress, setProgress, cache, setCache, results, setResults, loadUser}}>
            {children}
        </UserDataContext.Provider>
    );
}



export {
    UserDataContext, UserDataProvider, useUserData
};

