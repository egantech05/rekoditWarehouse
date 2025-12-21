import { StyleSheet } from "react-native";
import { colors } from "../../../../assets/styles";

export const TeamMemberStyles = StyleSheet.create({
    container:{
        backgroundColor:colors.bright,
        borderRadius:8,
        padding:8,
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:8,
    },

    name:{
        fontSize:16,
        color:colors.boldColor,
        fontWeight:"bold",
    },

    email:{
        fontSize:12,
        color:colors.boldColor,
    },

    roles:{
        paddingHorizontal:16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.boldColor,
    },

    rolesText:{
        color: colors.brandHighlight,
        fontWeight: "bold",
    },
});