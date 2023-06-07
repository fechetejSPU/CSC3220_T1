import {View, Text, Modal, Button} from "react-native";
import {useEffect, useState} from "react";
import Navigation from './navigation';
import Database from "./database";
import Graph from "./graph";
import Styling from "./styling";

//resets for some reason every month change if inside function
let expenseGraph = null;
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
                description += expenses[keys[i]].budget.CatName + " (";
                description += Graph.getCatColor(expenses[keys[i]].budget.CatName)
                description += "):\n";
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
    }, [getMonth, props.getMode]);

    useEffect(updateGraph, [getMonth]);

    function updateGraph() {
        if (expenseGraph != null) {
            getAllExpenses().then((expenses) => {
                expenseGraph.updateExpenses(expenses, getMonth);
            });
        }
    }

    function recieveGraph(graph) {
        expenseGraph = graph;
        updateGraph();
    }

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
        <View style = {Styling.modify(Styling.styleSheet.background, {
            flexDirection: "column",
            height:"100%"
        })}>
            <Navigation
                setMode={props.setMode}
                style={Styling.modify(Styling.styleSheet.title, {
                    flex:1
                })}
            />
            <Text style={Styling.modify(Styling.styleSheet.title, {
                flex:1
            })}>Statistics</Text>
            <View style={Styling.modify(Styling.styleSheet.title, {
                flex:1,
                flexDirection:"row",
                justifyContent:"center",
                alignItems:"center",
            })}>
                <View><Button
                    title="<"
                    onPress={decreaseMonth}
                /></View>
                <Text style={Styling.styleSheet.text}> {getMonthText} </Text>
                <View><Button
                    title=">"
                    onPress={increaseMonth}
                /></View>
            </View>
            <View style={Styling.modify(Styling.styleSheet.title, {
                flex:7,
                justifyContent:"center",
                alignItems:"center",
            })}>
                <Graph
                    getGraph={recieveGraph}
                />
            </View>
            <View style={Styling.modify(Styling.styleSheet.title, {
                flex:10,
            })}>
                <Text style={Styling.styleSheet.text}>
                    {getDescription}
                </Text>
            </View>
        </View>
    </Modal>);
}
