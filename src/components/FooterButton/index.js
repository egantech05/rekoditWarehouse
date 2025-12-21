import { View, Text, StyleSheet,Pressable } from "react-native";

import {colors} from "../../assets/styles"

export default function FooterButton({text, color, textColor}){
    return(
        <Pressable style={[FooterBtnStyles.container, color && { backgroundColor: color }]}>
                <Text style={textColor && { color: textColor }}>{text}</Text>
        </Pressable>
    );
};

export const FooterBtnStyles = StyleSheet.create({
    container:{
        backgroundColor: colors.boldColor,
        borderRadius: 16,
        padding:16,
        alignItems: "center",
        flex:1,
       
    },

});