import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../assets/styles"




export default function AddProperty (){
    return(
        <Pressable style={styles.container}>
            <Ionicons name="add-circle-outline" size={24} color={colors.greyText} />
            <Text style={styles.title}>Add Property</Text>

        </Pressable>
    );
};

export const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.brightDarker,
        borderWidth: 2,
        borderColor: colors.brightOutline,
        paddingVertical: 8,
        paddingHorizontal:16,
        borderRadius: 8,
        marginTop: 8,
        flexDirection:"row",
        alignItems:"center",
        gap:8,
    

    },

    title:{
                fontSize: 13,
                color: colors.greyText,
                fontWeight: "bold",
    },


});