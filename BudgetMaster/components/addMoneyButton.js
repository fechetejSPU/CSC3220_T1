import { Button } from "react-native";

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
    return (<Button
        title = {"$" + (props.amountAdd/100)}
        onPress={addMoney}
    />);
}
