import {View, Text, Modal} from "react-native";
import Navigation from './navigation';

export default function Settings(props) {
    return (<Modal visible={props.getMode == "settings"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Settings</Text>
        </View>
    </Modal>);
}
