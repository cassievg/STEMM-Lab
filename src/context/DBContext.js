import { drizzle } from "drizzle-orm/singlestore/driver";
import { openDatabaseSync } from "expo-sqlite";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DatabaseContext = createContext();

const useDatabase = () => useContext(DatabaseContext);

const DatabaseProvider = ({ children, uri }) => {
    const [curUri, setCurUri] = useState('');

    const db = useMemo(() => {
        return drizzle(openDatabaseSync(curUri));
    }, [curUri]);

    useEffect(() => {
        setCurUri(uri);
    }, [uri]);

    return (
        <DatabaseContext.Provider value={{db, setCurUri, curUri}}>
            {children}
        </DatabaseContext.Provider>
    );
};

export {
    DatabaseContext, DatabaseProvider, useDatabase
};

