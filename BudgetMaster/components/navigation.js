import {View, Button} from "react-native";

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
    return (<View>
        <Button
            title="Add Spending"
            onPress={setSpending}
        />
        <Button
            title="View Statistics"
            onPress={setStatistics}
        />
        <Button
            title="Settings"
            onPress={setSettings}
        />
    </View>);
}
