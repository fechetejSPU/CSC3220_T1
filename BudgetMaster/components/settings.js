import {View, Text, Modal, Button, FlatList} from "react-native";
import { useEffect, useState } from 'react';
import Navigation from './navigation';
import AddCategory from "./addCategory";
import Category from "./category";
import Database from "./database";
import Styling from "./styling";

export default function Settings(props) {
    const [getAddingCat, setAddingCat] = useState(false);
    const [getCategories, setCategories] = useState([]);
    const database = Database();
    let categories = []
    function addCategory() {
        setAddingCat(true);
    }
    function addedCategory() {
        setAddingCat(false);
        updateCategories();
    }
    function updateCategories() {
        database.createdPromise.then(()=> {
            database.getCategories().then((cats) => {
                let removingCategories = []
                for (let i = 0; i < categories.length; i++) {
                    if (!cats.includes(categories[i].id)) {
                        removingCategories.push(categories[i].id);
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
    function formatAmount(num) {
        return (Math.round(num)/100).toString();
    }

    useEffect(updateCategories,[]);

    return (<Modal visible={props.getMode == "settings"}>
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
            })}>Settings</Text>
            <View style = {{
                flex:17,
            }}><FlatList
                data={getCategories}
                renderItem={({item}) => <Category 
                    catName={item.cat.CatName}
                    amount={formatAmount(item.cat.Amount)}
                    id={item.id}
                    updateMethod={updateCategories}
                />}
                keyExtractor={item => item.id}
            /></View>
            <View style = {{
                flex:1,
            }}><Button
                title = "Add category"
                onPress={addCategory}
                color={Styling.mainColor}
            /></View>
            <AddCategory
                addedCategory={addedCategory}
                visible={getAddingCat}
            />
        </View>
    </Modal>);
}
