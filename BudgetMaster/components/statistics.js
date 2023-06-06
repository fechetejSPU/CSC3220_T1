import {View, Text, Modal} from "react-native";
import Navigation from './navigation';

export default function Statistics(props) {
    return (<Modal visible={props.getMode == "statistics"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Statistics</Text>
        </View>
    </Modal>);
}
