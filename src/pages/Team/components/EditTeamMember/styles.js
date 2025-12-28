import { StyleSheet } from "react-native";
import { colors } from "../../../../assets/styles";

export const EditTeamStyles= StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent: "flex-end",
        marginBottom:8,
    },

    editRoles:{
        backgroundColor:colors.bright,
        borderRadius:8,
        paddingHorizontal:16,
        paddingVertical: 8,
        justifyContent:"center",
        marginHorizontal:8,
    },

    roles:{
        fontSize:13,
        color:colors.boldColor,
        fontWeight:"bold",
    },

    remove:{
        backgroundColor:colors.bright,
        borderRadius:8, 
        paddingHorizontal:16,
        paddingVertical: 8,
    },


});