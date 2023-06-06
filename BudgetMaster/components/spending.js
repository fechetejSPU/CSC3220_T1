import {View, Text, Modal} from "react-native";
import Navigation from './navigation';

export default function Spending(props) {
    return (<Modal visible={props.getMode == "spending"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Spending</Text>
        </View>
    </Modal>);
}
