import  {StyleSheet } from "react-native";
import {colors} from "../../assets/styles"

export const statusBarStyles = StyleSheet.create({

    container:{
        backgroundColor: colors.boldColor,
        borderRadius:8,
        flexDirection:"row",
       justifyContent: "space-between",
        margin: 8,
        paddingHorizontal: 16,
        paddingVertical:8,
        
    },

    warehouse:{
        flexDirection:"row",
        alignItems:"center",

    },

    warehouseName:{
        color: "white",
        fontSize:13,
        margin:8,
        fontWeight:"bold",
    },

    user:{
        flexDirection:"row",
        alignItems:"center",
    },

    userName:{
        color:"white",
        margin:8,
        fontSize:13,
    },

});