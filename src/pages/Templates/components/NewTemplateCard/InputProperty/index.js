import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../assets/styles"




export default function InputProperty({ title, value, onChangeText, showDelete, onDelete }) {
    return(
        <View style={styles.container}>
            
            <Text style={styles.title}>{title}</Text>
            <View style={styles.inputInline}>
            <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
            {showDelete ? (
            <Pressable onPress={onDelete}>
                <Ionicons name="close-circle-outline" size={24} color={colors.red} />
            </Pressable>
            ) : null}
            </View>

        </View>
    );
};

export const styles = StyleSheet.create({

    container: {
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: colors.brightOutline,
        paddingVertical: 8,
        paddingHorizontal:16,
        borderRadius: 8,
        marginTop: 8,
    

    },

    title:{
                fontSize: 11,
                color: colors.greyText,
    },

    inputInline:{
        flexDirection:"row",
    },

    input:{
        outlineStyle: 'none',
        fontSize: 16,
        color: colors.boldColor,
        padding:8,
        fontWeight: "bold",
        flex:1,
      },
});