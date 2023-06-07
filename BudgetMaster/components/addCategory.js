import {useState} from "react";
import {View, Text, Button, TextInput} from "react-native";
import Database from "./database";
import Styling from "./styling";

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
                props.addedCategory();
            });
        });
    }

    return (<View style={{
        position:"absolute",
        flexDirection:"column",
        alignItems:"center",
        alignContent:"center",
        justifyContent:"center",
        alignSelf:"center",
        bottom:"40%",
    }}>
        {props.visible &&
        <View style={{
            backgroundColor:Styling.bgColor,
            flex:1
        }}>
            <Text style={Styling.modify(Styling.styleSheet.text, {
                flex:1
            })}> Category name: </Text>
            <TextInput
                onChangeText={setCatName}
                value={getCatName}
                style={Styling.modify(Styling.styleSheet.text, {
                    flex:1
                })}
            />
            <Text style={Styling.modify(Styling.styleSheet.text, {
                flex:1
            })}> Category amount: </Text>
            <TextInput
                onChangeText={setCatAmount}
                inputMode="numeric"
                value={getCatAmount}
                style={Styling.modify(Styling.styleSheet.text, {
                    flex:1
                })}
            />
            <View style={{
                flex:1
            }}><Button
                title = "Add"
                onPress={addCategory}
                color={Styling.mainColor}
            /></View>
        </View>}
    </View>);
}
