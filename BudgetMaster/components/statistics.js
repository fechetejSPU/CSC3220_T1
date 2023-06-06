import {View, Text, Modal, Button} from "react-native";
import Navigation from './navigation';
import Database from "./database";
import {useEffect, useState} from "react";

export default function Statistics(props) {
    let currrentDay = new Date();
    let currentMonth = (currrentDay.getFullYear()-2020)*12 + currrentDay.getMonth();
    const [getMonth, setMonth] = useState(currentMonth);
    const [getMonthText, setMonthText] = useState("");

    useEffect(() => {
        let selectedMonth = getMonth%12;
        let selectedYear = (getMonth-selectedMonth)/12+2020;
        let selectedDate = new Date(selectedYear, selectedMonth);
        let month = new Intl.DateTimeFormat("en-US",{month:"long"}).format(selectedDate);
        setMonthText(month + " " + selectedDate.getFullYear());
    }, [getMonth]);

    function increaseMonth() {
        setMonth(getMonth+1);
    }

    function decreaseMonth() {
        setMonth(getMonth-1);
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
    </Modal>);
}
