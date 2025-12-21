import { View, Text,Pressable } from "react-native";
import { DropDownStyles } from "./styles";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../assets/styles"

export default function DropDown ({title}){

    return(
        <Pressable style={DropDownStyles.container}>
            <Text style={DropDownStyles.title}>{title}</Text>
            <View style={DropDownStyles.inputBox}>
                <Text style={DropDownStyles.input}>Select Template</Text>
                <Ionicons name="caret-down-outline" size={16} color={colors.boldColor} />
            </View>

        </Pressable>
    );
};