import { View, Text, StyleSheet,Pressable } from "react-native";

import {colors} from "../../assets/styles"

export default function FooterTextButton({text, color, textColor, onPress, disabled}){
    return(
        <Pressable 
            onPress = {onPress}
            disabled = {disabled}
            style={[
                FooterBtnStyles.container, 
                color && { backgroundColor: color},
                disabled && {opacity:0.5}
            ]}
        >
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