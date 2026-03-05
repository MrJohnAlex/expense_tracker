import { FlatList } from "react-native";
import Item from "./Item";

export default function List({data}) {
    return <FlatList data={data} renderItem={({item}) => <Item data={item} />} keyExtractor={item => item.id} />
}