import { View, Text, Button } from "react-native";
import Database from "./database";

export default function Category(props) {
    const database = Database();
    function deleteCategory() {
        database.createdPromise.then(() => {
            database.removeCategory(props.id).then(() => {
                props.updateMethod();
            });
        });
    }
    return (<View>
        <Text> {props.catName} : {props.amount} </Text>
        <Button
            title = "Remove"
            onPress={deleteCategory}
        />
    </View>);
}
