import {View,TextInput,StyleSheet, Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {colors} from "../../assets/styles"



export default function SearchBar({ value, onChangeText, onSubmit, placeholder = "Search" }){
    const [internalValue, setInternalValue] = useState("");
    const text = value !== undefined ? value : internalValue;
    const handleChangeText = onChangeText ?? setInternalValue;

    return(
        <View style={SearchBarStyles.container}>
            <TextInput
                style={SearchBarStyles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.secondary}
                underlineColorAndroid="transparent"
                value={text}
                onChangeText={handleChangeText}
                onSubmitEditing={() => onSubmit?.(text)}
            
            />
              <Pressable onPress={() => onSubmit?.(text)}>
                 <Ionicons name={"search-outline"} size={24} color={colors.boldColor} />
             </Pressable>
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
        flex:1,
        fontSize: 13,
        color:colors.boldColor,
        outlineStyle: 'none',
    },

});