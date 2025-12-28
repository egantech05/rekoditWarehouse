import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles"

export const navBarStyle = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
    },
    warehouse: {
        flexDirection: "row",
        backgroundColor: colors.boldColor,
        zIndex: 4,

        position: "relative",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingHorizontal: 24,
        paddingTop: 8,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,

    },
    warehouseText: {
        color: colors.brandHighlight,
        fontSize: 13,
    },
    template: {
        backgroundColor: "#292929",
        marginTop: -24,
        zIndex: 3
    },
    templateText: {

        color: "white",
        fontSize: 13,
    },
    team: {
        flexDirection: "row",
        backgroundColor: "#333333",
        marginTop: -24,
        zIndex: 2
    },
    teamText: {

        color: "white",
        fontSize: 13,
    },
    logout: {
        flexDirection: "row",
        backgroundColor: "#B63D3F",
        marginTop: -24,
        zIndex: 1

    },
    logoutText: {
        color: "white",
        fontSize: 13,
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
    }

});

