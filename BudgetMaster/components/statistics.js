import {View, Text, Modal, Button} from "react-native";
import Navigation from './navigation';
import Database from "./database";
import {useEffect, useState} from "react";

export default function Statistics(props) {
    let currrentDay = new Date();
    let currentMonth = (currrentDay.getFullYear()-2020)*12 + currrentDay.getMonth();
    const [getMonth, setMonth] = useState(currentMonth);
    const [getMonthText, setMonthText] = useState("");
    const [getDescription, setDescription] = useState("");
    const database = Database();

    useEffect(() => {
        let selectedMonth = getMonth%12;
        let selectedYear = (getMonth-selectedMonth)/12+2020;
        let selectedDate = new Date(selectedYear, selectedMonth);
        let month = new Intl.DateTimeFormat("en-US",{month:"long"}).format(selectedDate);
        setMonthText(month + " " + selectedDate.getFullYear());
    }, [getMonth]);

    useEffect(() => {
        getAllExpenses().then((expenses) => {
            let description = ""
            let keys = Object.keys(expenses);
            let total = 0;
            for (let i = 0; i < keys.length; i++) {
                total += expenses[keys[i]].budget.Amount;
            }
            description += "Total Budget: $" + Math.round(total)/100 + "\n";

            for (let i = 0; i < keys.length; i++) {
                description += expenses[keys[i]].budget.CatName + ":\n";
                description += "\tBudget: " + expenses[keys[i]].budget.Amount + "\n";
                description += "\tPurchases Count: " + expenses[keys[i]].expenses.length + "\n";
                let total = 0;
                for (let j = 0; j < expenses[keys[i]].expenses.length; j++) {
                    total += expenses[keys[i]].expenses[j].Amount;
                }
                description += "\tPercentage used: %" + Math.round(100*total/expenses[keys[i]].budget.Amount) + "\n";

            }
            
            setDescription(description);
        });
    }, [getMonth]);

    function increaseMonth() {
        setMonth(getMonth+1);
    }

    function decreaseMonth() {
        setMonth(getMonth-1);
    }

    function getAllExpenses() {
        return new Promise((resolve) => {
            database.createdPromise.then(() => {
                database.getBudgets(getMonth).then((budgets) => {
                    let allExpenses = {};
                    let bLeft = budgets.length*2;
                    if (bLeft == 0) {
                        resolve(allExpenses);
                    };
                    for (let i = 0; i < budgets.length; i++) {
                        allExpenses[budgets[i]] = {expenses:[]};
                        database.getExpenses(budgets[i]).then((expenses) => {
                            let eLeft = expenses.length;
                            if (eLeft == 0 && --bLeft ==0) {
                                resolve(allExpenses);
                            };
                            for (let j = 0; j < expenses.length; j++) {
                                database.getExpense(expenses[j]).then((expense) => {
                                    allExpenses[budgets[i]].expenses.push(expense);
                                    if (--eLeft == 0 && --bLeft == 0) {
                                        resolve(allExpenses);
                                    }
                                });
                            };
                        });
                        database.getBudget(budgets[i]).then((budget) => {
                            allExpenses[budgets[i]]["budget"] = budget;
                            if (--bLeft == 0) {
                                resolve(allExpenses);
                            };
                        });
                    };
                });
            });
        });
    }

    return (<Modal visible={props.getMode == "statistics"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Statistics</Text>
            <View>
                <Button
                    title="<"
                    onPress={decreaseMonth}
                />
                <Text> {getMonthText} </Text>
                <Button
                    title=">"
                    onPress={increaseMonth}
                />
            </View>
        </View>
        <View>
        <Text>
            {getDescription}
        </Text>
        </View>
    </Modal>);
}
