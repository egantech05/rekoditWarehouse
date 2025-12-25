import {StyleSheet,Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../assets/styles"

export default function AddCard({onPress, disabled}){

    return(
        <Pressable style={[AddCardStyles.container, disabled && AddCardStyles.disabled]} onPress={onPress} disabled={disabled}>
            <Ionicons name={"add-circle-outline"} size={32} color={disabled ? colors.greyText : colors.brandHighlight} />
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

    disabled:{
        opacity:0.5,
    },
});