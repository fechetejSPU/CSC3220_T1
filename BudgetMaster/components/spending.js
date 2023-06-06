import {View, Text, Modal, TextInput} from "react-native";
import Navigation from './navigation';
import Draggable from "react-native-draggable";
import {useState} from "react";
import AddMoneyButton from "./addMoneyButton";

export default function Spending(props) {
    const [getSpending, setSpending] = useState("0");

    return (<Modal visible={props.getMode == "spending"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Spending</Text>     
            <View>
                <View style={{
                    overflow:'visible',
                    zIndex:3
                }}>
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
                <View>
                    <AddMoneyButton
                        amountAdd={100}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                    />
                    <AddMoneyButton
                        amountAdd={500}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                    />
                    <AddMoneyButton
                        amountAdd={1000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                    />
                </View>
                <View>
                    <AddMoneyButton
                        amountAdd={2000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                    />
                    <AddMoneyButton
                        amountAdd={5000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                    />
                    <AddMoneyButton
                        amountAdd={10000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                    />
                </View>
            </View>
        </View>
    </Modal>);
}
