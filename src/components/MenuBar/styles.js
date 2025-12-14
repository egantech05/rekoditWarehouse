import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const menuBarStyle = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
    },
    bar: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingTop: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 6, // Android
    },
    firstBar: {
        flexDirection: "row",
        backgroundColor: colors.boldColor,
        position: "relative",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingHorizontal: 24,
        paddingTop: 8,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    firstBarText: {
        color: colors.brandHighlight,
        fontSize: 16,
    },
    followingBar: {
        backgroundColor: "#292929",
        marginTop: -24,
    },
    followingBarText: {
        color: "white",
        fontSize: 16,
    },
    lastBar: {
        backgroundColor: "#292929",
        marginTop: -24,
    },
    lastBarText: {
        color: "white",
        fontSize: 16,
    },
});