import {View, Text, Modal, Button, FlatList} from "react-native";
import { useEffect, useState } from 'react';
import Navigation from './navigation';
import AddCategory from "./addCategory";
import Category from "./category";
import Database from "./database";

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

    useEffect(updateCategories,[]);

    return (<Modal visible={props.getMode == "settings"}>
        <View>
            <Navigation
                setMode={props.setMode}
            />
            <Text>Settings</Text>
            <FlatList
                data={getCategories}
                renderItem={({item}) => <Category 
                    catName={item.cat.CatName}
                    amount={item.cat.Amount}
                    id={item.id}
                    updateMethod={updateCategories}
                />}
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
