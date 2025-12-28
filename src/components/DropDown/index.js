import { View, Text,Pressable } from "react-native";
import { DropDownStyles } from "./styles";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../assets/styles"

export default function DropDown({ title, value, placeholder = "Select Template", onPress, disabled = false }) {
    return (
      <Pressable style={DropDownStyles.container} onPress={onPress} disabled={disabled}>
            <Text style={DropDownStyles.title}>{title}</Text>
            <View style={DropDownStyles.inputBox}>
                <Text style={DropDownStyles.input}>{value ? String(value) : placeholder}</Text>
                <Ionicons name="caret-down-outline" size={16} color={colors.boldColor} />
            </View>

        </Pressable>
    );
};