import {View,Text,StyleSheet,Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../assets/styles"

export default function AddCard(){

    return(
        <Pressable style={AddCardStyles.container}>
            <Ionicons name={"add-circle-outline"} size={32} color={colors.brandHighlight} />
        </Pressable>
    );
}

export const AddCardStyles= StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:16,
        marginHorizontal:16,
        padding:8,
        backgroundColor: colors.boldColor,
        borderRadius: 8,


    },
});