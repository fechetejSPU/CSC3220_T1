import {View, Text, Modal, Button, FlatList} from "react-native";
import { useState } from 'react';
import Navigation from './navigation';
import AddCategory from "./addCategory";
import Database from "./database";

export default function Settings(props) {
    const [getAddingCat, setAddingCat] = useState(false);
    const database = Database();
    let categories = [];
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
                for (let i = 0; i < categories.length; i++) {
                    if (!cats.includes(categories[i].id)) {
                        categories.splice(i--,1);
                    }
                }
                for (let i = 0; i < cats.length; i++) {
                    if (!categories.some((cat) => cat.id == cats[i])) {
                        database.getCategory(cats[i]).then((result) => {
                            categories.push({id : cats[i], cat : result});
                        });
                    }
                }
            });
        });
    }
    updateCategories();
    return (<Modal visible={props.getMode == "settings"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Settings</Text>
            <FlatList
                data={categories}
                renderItem={({item}) => <Text> {item.cat.CatName} </Text>}
                keyExtractor={item => item.id}
            />
            <AddCategory
                addedCategory={addedCategory}
                visible={getAddingCat}
            />
            <Button
                title = "Add category"
                onPress={addCategory}
            />
        </View>
    </Modal>);
}
