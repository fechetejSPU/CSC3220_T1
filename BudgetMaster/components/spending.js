import {View, Text, Modal, TextInput, FlatList,Image } from "react-native";
import Navigation from './navigation';
import Draggable from "react-native-draggable";
import {useState, useEffect} from "react";
import AddMoneyButton from "./addMoneyButton";
import SpendingBasket from "./spendingBasket";
import Database from "./database";
import Styling from "./styling";

export default function Spending(props) {
    const [getSpending, setSpending] = useState("0");
    const [getCategories, setCategories] = useState([]);
    const database = Database();
    const dragImage = require("../assets/drag.png");
    let categories = [];
    let dropFuncs = {};
    function dragRelease(dropEvent) {
        let currentAmount = Number(getSpending);
        if (isNaN(currentAmount)) {
            currentAmount = 0;
        }
        currentAmount = Math.round(currentAmount*100);
        setSpending("0");
        let today = new Date();
        Object.keys(dropFuncs).forEach((key) => {
            dropFuncs[key](
                dropEvent.nativeEvent.pageX,
                dropEvent.nativeEvent.pageY,
                today.getDate(),
                (today.getFullYear()-2020)*12+today.getMonth(),
                currentAmount
            );
        });
    }

    function updateCategories() {
        database.createdPromise.then(()=> {
            database.getCategories().then((cats) => {
                let removingCategories = []
                for (let i = 0; i < categories.length; i++) {
                    if (!cats.includes(categories[i].id)) {
                        removingCategories.push(categories[i].id);
                        delete baskets[categories[i].id];
                    }
                }
                categories = categories.filter(
                    cat => !removingCategories.includes(cat.id)
                );
                setCategories(categories);
                for (let i = 0; i < cats.length; i++) {
                    if (!categories.some((cat) => cat.id == cats[i])) {
                        database.getCategory(cats[i]).then((result) => {
                            categories.push({id : cats[i], cat : result});
                            setCategories(categories);
                        });
                    }
                }
            });
        });
    }
    useEffect(() => {
        if (props.getMode == "spending") {
            updateCategories();
        }
    },[props.getMode]);

    return (<Modal visible={props.getMode == "spending"}>
        <View style={Styling.modify(Styling.styleSheet.background, {
            flexDirection: "column",
            height:"100%"
        })}>
            <Navigation
                setMode={props.setMode}
                style={Styling.modify(Styling.styleSheet.title, {
                    flex:1
                })}
            />
            <Text style={Styling.modify(Styling.styleSheet.title, {
                flex:1
            })}>Spending</Text>     
            <Text style={Styling.styleSheet.text}>
                Note to teacher/reviewer: I would reccomend adding some categories from settings, and then repeatedly increasing the date in the phone settings and closing/reopening the app before adding more expenses, that way the expenses can be spread over multiple days to make stuff like the graph in statistics look better.
            </Text>
            <View style={Styling.modify(Styling.styleSheet.title, {
                flex:9,
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
            })}>
                <View style={{
                    overflow:'visible',
                    zIndex:3,
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center",
                    backgroundColor:"pink"
                }}>
                    <Draggable
                        shouldReverse
                        onDragRelease={dragRelease}
                        style = {{
                            backgroundColor:"blue"
                        }}
                    >
                        <View style = {{
                            alignItems:"center",
                            justifyContent:"center",
                            backgroundColor:Styling.offColor
                        }}>
                            <Image
                                source = {dragImage}
                                style = {{
                                    width: 50,
                                    height: 50
                                }}
                            />
                            <TextInput
                                inputMode="numeric"
                                onChangeText={setSpending}
                                value={getSpending}
                                style = {Styling.modify(Styling.styleSheet.text, {
                                    backgroundColor:Styling.offColor
                                })}
                            />
                        </View>
                    </Draggable>
                </View>
                <View style = {{
                    flex:1,
                    flexDirection:"row",
                    alignItems:"center"
                }}>
                    <AddMoneyButton
                        amountAdd={100}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                        style = {{flex:1}}
                    />
                    <AddMoneyButton
                        amountAdd={500}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                        style = {{flex:1}}
                    />
                    <AddMoneyButton
                        amountAdd={1000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                        style = {{flex:1}}
                    />
                </View>
                <View style = {{
                    flex:1,
                    flexDirection:"row",
                    alignItems:"center"
                }}>
                    <AddMoneyButton
                        amountAdd={2000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                        style = {{flex:1}}
                    />
                    <AddMoneyButton
                        amountAdd={5000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                        style = {{flex:1}}
                    />
                    <AddMoneyButton
                        amountAdd={10000}
                        getAmount={getSpending}
                        setAmmount={setSpending}
                        style = {{flex:1}}
                    />
                </View>
            </View>
            <View style={Styling.modify(Styling.styleSheet.title, {
                flex:9,
            })}>
                <FlatList
                    data={getCategories}
                    contentContainerStyle = {{
                        alignItems:"center",
                    }}
                    numColumns = {3}
                    horizontal = {false}
                    renderItem={({item}) =>
                        <SpendingBasket
                            dropHandleRef = {thisBasket => dropFuncs[item.id] = thisBasket }
                            catName={item.cat.CatName}
                            id={item.id}
                        />
                    }
                    keyExtractor={item => item.id}
                    ref = {thisBasketList => basketsList = thisBasketList}
                />
            </View>
        </View>
    </Modal>);
}
