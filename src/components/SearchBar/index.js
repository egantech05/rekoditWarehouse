import {View,Text,StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../assets/styles"



export default function SearchBar(){

    return(
        <View style={SearchBarStyles.container}>
            <View style={SearchBarStyles.input}></View>
             <Ionicons name={"search-outline"} size={24} color={colors.boldColor} />
        </View>
    );

};

export const SearchBarStyles = StyleSheet.create({
    container: {
        flexDirection:"row",
        backgroundColor: colors.bright,
        justifyContent:"space-between",
        borderRadius:8,
        marginHorizontal:16,
        paddingHorizontal:16,
        paddingVertical:8,


    },

    input:{
        fontSize: 16,
        color:colors.boldColor,
    },

});