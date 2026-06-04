import { createContext, useContext, useEffect, useState } from 'react';
import { renderUserData } from '../database/databaseServices';
import { useAuth } from './AuthContext';
import { useDatabase } from './DBContext';

const UserDataContext = createContext();

const useUserData = () => useContext(UserDataContext);

const UserDataProvider = ({ children }) => {
    const { currentUser, userId } = useAuth();
    const { db } = useDatabase();

    const [userData, setUserData] = useState([]);
    
    const [progress, setProgress] = useState([]);    
    const [cache, setCache] = useState([]);    
    const [results, setResults] = useState([]);

    useEffect(() => {
        const loadUser = async () => {
            return await renderUserData(db, userId);
        };

        const init = async () => {
            let user;

            if (userId) {
                user = await loadUser();
                setProgress(user.userProgress);
                setCache(user.userCache);
                setResults(user.userResults);
                setUserData(user);
            }
            else {
                setProgress(null);
                setCache(null);
                setResults(null);
                setUserData(null);
            }
        };

        init();
    }, [userId])

    return (
        <UserDataContext.Provider value={{progress, setProgress, cache, setCache, results, setResults, loadUser}}>
            {children}
        </UserDataContext.Provider>
    );
}



export {
    UserDataContext, UserDataProvider, useUserData
};

