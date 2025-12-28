
import { View, Text, Pressable,StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../../assets/styles"

export default function EditButtons({ onRemove, onEdit, canRemove = false, disabled = false, isEditing = false }) {
    return(
        <View style={EditBtnStyles.tabSelection}>
            <Pressable
                style={[EditBtnStyles.button, (!canRemove || disabled) && { opacity: 0.4 }]}
                onPress={onRemove}
                disabled={disabled || !canRemove}
            >
                <Ionicons name="trash-outline" size={24} color={colors.red} />
            </Pressable>

            <Pressable
                style={[
                EditBtnStyles.button,
                isEditing && { backgroundColor: colors.boldColor },
                disabled && { opacity: 0.4 },
                ]}
                onPress={onEdit}
                disabled={disabled}
                >
                <Ionicons
                name={isEditing ? "save-outline" : "create-outline"}
                size={24}
                color={isEditing ? colors.brandHighlight : colors.boldColor}
                />
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