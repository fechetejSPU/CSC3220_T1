import { StyleSheet } from "react-native";

let Styling = {};

Styling.bgColor = "#151F27";
Styling.bgAltColor = "#2E3A44";
Styling.mainColor = "#50D63F";
Styling.offColor = "#EFF3F6";

Styling.styleSheet = StyleSheet.create({
    title: {
        color: Styling.offColor,
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 5
    },
    sectionTitle: {
        color: Styling.offColor,
        fontSize: 20,
    },
    text: {
        color: Styling.mainColor,
        fontSize: 16,
    },
    background: {
        backgroundColor: Styling.bgColor
    }
});

Styling.modify = (style, modifications) => {
    return StyleSheet.compose(style, modifications);
}

export default Styling;
