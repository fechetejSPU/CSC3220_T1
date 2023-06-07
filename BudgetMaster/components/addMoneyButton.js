import { Button,View } from "react-native";
import Styling from "./styling";

export default function AddMoneyButton(props) {
    function addMoney() {
        let curAmount = Number(props.getAmount);
        if (isNaN(curAmount)) {
            curAmount = 0;
        }
        curAmount *= 100;
        curAmount += props.amountAdd;
        props.setAmmount((Math.round(curAmount)/100).toString());
    }
    return (<View style = {props.style}><Button
        title = {"$" + (props.amountAdd/100)}
        onPress={addMoney}
        color = {Styling.mainColor}
    /></View>);
}
