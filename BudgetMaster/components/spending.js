import {View, Text, Modal, TextInput} from "react-native";
import Navigation from './navigation';
import Draggable from "react-native-draggable";
import {useState} from "react";

export default function Spending(props) {
    const [getSpending, setSpending] = useState("0");

    return (<Modal visible={props.getMode == "spending"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Spending</Text>
            <View>
                <Draggable
                    shouldReverse
                >
                    <TextInput
                        inputMode="numeric"
                        onChangeText={setSpending}
                        value={getSpending}
                    />
                </Draggable>
            </View>
        </View>
    </Modal>);
}
