import {View, Button} from "react-native";
import Styling from "./styling";

export default function Navigation(props) {
    function setSpending() {
        props.setMode("spending");
    }
    function setStatistics() {
        props.setMode("statistics");
    }
    function setSettings() {
        props.setMode("settings");
    }
    return (<View style = {{flexDirection: "row"}}>
        <View style = {{flex:1}}><Button
            title="Add Spending"
            onPress={setSpending}
            color = {Styling.mainColor}
        /></View>
        <View style = {{flex:1}}><Button
            title="View Statistics"
            onPress={setStatistics}
            color = {Styling.mainColor}
        /></View>
        <View style = {{flex:1}}><Button
            title="Settings"
            onPress={setSettings}
            color = {Styling.mainColor}
        /></View>
    </View>);
}
