import {useState} from "react";
import { Image, View, Text } from "react-native";
import Database from "./database";
import Styling from "./styling";

export default function SpendingBasket(props) {
    const basketImage = require("../assets/basket.png");
    const [getBasketLayout, setBasketLayout] = useState({x:0,y:0,w:0,h:0});
    const database = Database();

    function handleDrop(x,y,day,month,amount) {
        if (
            x >= getBasketLayout.x &&
            x <= getBasketLayout.x + getBasketLayout.w &&
            y >= getBasketLayout.y &&
            y <= getBasketLayout.y + getBasketLayout.h
        ) {
            database.createdPromise.then(() => {
                database.addExpense(props.id, day, month, amount);
            });
        }
    }

    function newLayout(layoutEvent) {
        layoutEvent.target.measure((_x, _y, w, h, px, py) => {
            setBasketLayout({x:px, y:py, w:w, h:h})
        });
    }

    let resultComponent = (<View style = {{margin:"10%"}}>
        <Image
            source = {basketImage}
            style = {{
                width: 50,
                height: 50
            }}
            onLayout = {newLayout}
        />
        <Text style = {Styling.styleSheet.text}>
            {props.catName}
        </Text>
    </View>);

    props.dropHandleRef(handleDrop);
    return resultComponent;
}
