import { View, StyleSheet, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../assets/styles";

export default function Header({ onMenuPress }) {
    return (
        <View style={headerStyles.header}>
            <Text style={headerStyles.appsName}>REKODIT</Text>
            <Pressable onPress={onMenuPress}>
                <Ionicons name="menu" size={24} color={colors.brandHighlight} />
            </Pressable>
        </View>
    );
}

const headerStyles = StyleSheet.create({
    header: {
        backgroundColor: colors.boldColor,
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    appsName: {
        color: colors.brandHighlight,
        fontSize: 16,
        fontWeight: "bold",
    },
});
