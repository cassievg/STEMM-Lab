import { drizzle } from "drizzle-orm/expo-sqlite";
import { documentDirectory } from "expo-file-system/legacy";
import { File } from "expo-file-system/next";
import { openDatabaseSync } from "expo-sqlite";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DatabaseContext = createContext();

const useDatabase = () => useContext(DatabaseContext);

const fixSQLiteDirectory = async () => {
    const sqlitePath = new File(documentDirectory + "SQLite");

    if (sqlitePath.exists && !sqlitePath.isDirectory) {
        sqlitePath.delete();
    }
};

const DatabaseProvider = ({ children, uri }) => {
    const [curUri, setCurUri] = useState(uri);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        fixSQLiteDirectory().then(() => setReady(true));
    }, []);

    useEffect(() => {
        setCurUri(uri);
    }, [uri]);

    const db = useMemo(() => {
        if (!ready || !curUri) return null;
        return drizzle(openDatabaseSync(curUri));
    }, [curUri, ready]);

    if (!ready || !db) return null;

    return (
        <DatabaseContext.Provider value={{db, setCurUri, curUri}}>
            {children}
        </DatabaseContext.Provider>
    );
};

export {
    DatabaseContext, DatabaseProvider, useDatabase
};

