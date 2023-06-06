import {useState} from "react";
import {View, Text, Button, TextInput} from "react-native";
import Database from "./database";

export default function AddCategory(props) {
    const [getCatName, setCatName] = useState("");
    const [getCatAmount, setCatAmount] = useState("");
    const database = Database();
    function addCategory() {
        let name = getCatName;
        let amount = Number(getCatAmount);
        setCatName("");
        setCatAmount("");
        if (isNaN(amount)) {
            amount = 0;
        }
        amount *= 100;
        amount = Math.round(amount);
        database.createdPromise.then(() => {
            database.addCategory(name, amount).then(() => {
                props.setAddingCat(false);
            });
        });
    }

    return (<View style={{position:"absolute"}}>
        {props.visible &&
        <View style={{backgroundColor:"rgba(255,255,255,255)"}}>
            <Text> Category name: </Text>
            <TextInput
                onChangeText={setCatName}
                value={getCatName}
            />
            <Text> Category amount: </Text>
            <TextInput
                onChangeText={setCatAmount}
                inputMode="numeric"
                value={getCatAmount}
            />
            <Button
                title = "Add"
                onPress={addCategory}
            />
        </View>}
    </View>);
}
