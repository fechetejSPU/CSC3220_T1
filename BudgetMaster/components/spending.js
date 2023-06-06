import {View, Text, Modal, TextInput, FlatList} from "react-native";
import Navigation from './navigation';
import Draggable from "react-native-draggable";
import {useState, useEffect} from "react";
import AddMoneyButton from "./addMoneyButton";
import SpendingBasket from "./spendingBasket";
import Database from "./database";

export default function Spending(props) {
    const [getSpending, setSpending] = useState("0");
    const [getCategories, setCategories] = useState([]);
    const database = Database();
    let categories = []
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
                        onDragRelease={dragRelease}
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
            <View>
                <FlatList
                    data={getCategories}
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
