import {View, Text, Modal, Button} from "react-native";
import { useState } from 'react';
import Navigation from './navigation';
import AddCategory from "./addCategory";

export default function Settings(props) {
    const [getAddingCat, setAddingCat] = useState(false);
    function addCategory() {
        setAddingCat(true);
    }
    return (<Modal visible={props.getMode == "settings"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Settings</Text>
            <AddCategory
                setAddingCat={setAddingCat}
                visible={getAddingCat}
            />
            <Button
                title = "Add category"
                onPress={addCategory}
            />
        </View>
    </Modal>);
}
