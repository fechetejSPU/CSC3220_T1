import { useEffect } from "react";
import * as SQLite from "expo-sqlite";

export default function Database() {
    const db = SQLite.openDatabase("budgetMaster.db");

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS Budget (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Amount INTEGER NOT NULL, Month INTEGER NOT NULL, CatName TEXT NOT NULL);CREATE TABLE IF NOT EXISTS Category (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, CatName TEXT NOT NULL, Amount INTEGER NOT NULL);CREATE TABLE IF NOT EXISTS Expense (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, DayOfMonth INTEGER NOT NULL, Amount INTEGER NOT NULL, Budget ANY REFERENCES Budget (ID));"
            );
        });
    }, []);
}
