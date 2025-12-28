import { View, Text, StyleSheet,Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../assets/styles"

export default function FooterIconButton({
    iconName,
    onPress,
    color,
    iconColor = colors.brandHighlight,
  }) {
    return(
        <Pressable onPress={onPress} style={[FooterBtnStyles.container, color && { backgroundColor: color }]}>
        <View style={FooterBtnStyles.row}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
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

    row: { 
        flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, 
    },



});