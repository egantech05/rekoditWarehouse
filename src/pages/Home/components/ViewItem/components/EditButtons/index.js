
import { View, Text, Pressable,StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../../assets/styles"

export default function EditButtons(){

    return(
        <View style={EditBtnStyles.tabSelection}>
            <Pressable style={EditBtnStyles.button}>
                <Ionicons name="trash-outline" size={24} color={colors.red} />
            </Pressable>
            <Pressable style={EditBtnStyles.button}>
                <Ionicons name="create-outline" size={24} color={colors.boldColor} />
            </Pressable>

        </View>
    );

};

export const EditBtnStyles = StyleSheet.create({
    tabSelection:{
        padding:4,
        flexDirection: "row",
        borderRadius: 8,
        gap:8,
      },

      button:{
        backgroundColor: "white",
        borderRadius: 8,   
        paddingVertical:8,
        paddingHorizontal:16,
      },

});