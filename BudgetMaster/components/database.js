import * as SQLite from "expo-sqlite";

export default function Database() {
    const db = SQLite.openDatabase("budgetMaster.db");

    this.createdPromise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                //Took me forever to debug this, looks like expo-sqlite implements very little, so I removed a lot of stuff from the schema. It also doesn't support multiple statements but it doesn't error if you try, so I couldn't figure out why the table didn't exist after I made it
                "CREATE TABLE IF NOT EXISTS Category (ID INTEGER PRIMARY KEY AUTOINCREMENT, CatName TEXT, Amount INTEGER);",
                [],(_tx,_) => {
                    tx.executeSql(
                        "CREATE TABLE IF NOT EXISTS Budget (ID INTEGER PRIMARY KEY AUTOINCREMENT, Amount INTEGER, Month INTEGER, CatName TEXT);",
                        [],
                        (_tx,_) => {
                            tx.executeSql(
                                "CREATE TABLE IF NOT EXISTS Expense (ID INTEGER PRIMARY KEY AUTOINCREMENT, DayOfMonth INTEGER, Amount INTEGER, Budget ANY REFERENCES Budget (ID));",
                                [],
                                (_tx,_) => {
                                    resolve();
                                },
                                (_tx,err) => {
                                    reject(err);
                                }
                            );

                        },
                        (_tx,err) => {
                            reject(err);
                        }
                    );
                    resolve();
                }, (_,err) => {
                    reject(err);
                }
            );
        });
    });

    this.removeCategory = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM Category WHERE ID=?;",
                    [id],
                    (_tx,_) => {
                        resolve();
                    },
                    (_tx,err) => {
                        reject(err);
                    }
                );
            });
        });
    };

    this.addCategory = (name, amount) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO Category (CatName, Amount) VALUES (?, ?)",
                    [name, amount],
                    (_tx,_) => {
                        resolve();
                    },
                    (_tx, err) => {
                        reject(err);
                    }
                );
            });
        });
    };

    this.getCategory = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT CatName, Amount FROM Category WHERE ID=?",
                    [id],
                    (_tx, result) => {
                        resolve(result.rows.item(0));
                    },
                    (_tx, err) => {
                        reject(err);
                    }
                );
            });
        });
    };

    this.getCategories = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT ID FROM Category",
                    [],
                    (_tx, result) => {
                        let ids = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            ids.push(result.rows.item(i).ID);
                        }
                        resolve(ids);
                    },
                    (_tx, err) => {
                        reject(err);
                    }
                );
            });
        });
    }

    //not sure where is best to document this, but gonna assume that month integer is months since 2020, so (curYear-2020)*12+curMonth
    this.getBudgets = (month) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT ID FROM Budget WHERE Month=?",
                    [month],
                    (_tx, result) => {
                        let ids = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            ids.push(result.rows.item(i).ID);
                        }
                        resolve(ids);
                    },
                    (_tx, err) => {
                        reject(err);
                    }
                );
            });
        });
    }

    this.getBudget = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT Amount, CatName, Month FROM Budget WHERE ID=?",
                    [id],
                    (_tx, result) => {
                        resolve(result.rows.item(0));
                    },
                    (_tx, err) => {
                        reject(err);
                    }
                );
            });
        });
    }

    //not on this since shouldn't be called by other code
    //all budgets should be auto-created as expenses are added
    getCatBudget = (catId, month) => {
        return new Promise((resolve, reject) => {
            this.getCategory(catId).then((cat) => {
                db.transaction((tx) => {
                    tx.executeSql(
                        "SELECT ID from Budget WHERE CatName=? AND Month=?",
                        [cat.CatName, month],
                        (_tx, result) => {
                            if (result.rows.length == 0) {
                                tx.executeSql(
                                    "INSERT INTO Budget (CatName, Amount, Month) VALUES (?, ?, ?)",
                                    [cat.CatName, cat.Amount, month],
                                    (_tx, _) => {
                                        getCatBudget(catId, month).then((budgetId) => {
                                            resolve(budgetId);
                                        });
                                    },
                                    (_tx, err) => {
                                        reject(err);
                                    }
                                );
                            } else {
                                resolve(result.rows.item(0));
                            }
                        },
                        (_tx, err) => {
                            reject(err);
                        }
                    );
                });
            })
        });
    }

    return this;
}
