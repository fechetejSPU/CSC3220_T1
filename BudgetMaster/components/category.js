import { View, Text, Button } from "react-native";
import Database from "./database";
import Styling from "./styling";

export default function Category(props) {
    const database = Database();
    function deleteCategory() {
        database.createdPromise.then(() => {
            database.removeCategory(props.id).then(() => {
                props.updateMethod();
            });
        });
    }
    return (<View style = {{
        flexDirection:"row",
        margin:"3%",
        alignItems:"center"
    }}>
        <Text style = {Styling.styleSheet.text}> {props.catName} : ${props.amount} </Text>
        <Button
            title = "Remove"
            onPress={deleteCategory}
            color = {Styling.mainColor}
        />
    </View>);
}
