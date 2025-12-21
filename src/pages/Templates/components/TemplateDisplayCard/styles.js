import {StyleSheet} from "react-native";

import {colors} from "../../../../assets/styles"


export const TemplateDisplayCardStyles= StyleSheet.create({
    container:{
        width: 160,
        height:160,
        borderRadius: 16,
        padding: 8,
        backgroundColor: "white",
        justifyContent:"flex-end",

    },


    title:{
        fontSize: 16,
        fontWeight: "bold",
        color: colors.secondary,
        marginBottom:8,
        
    },

    pillList:{
        flexDirection:"row",
        flexWrap: "wrap",
        gap:4,
    },

    pill:{
        alignSelf: "flex-start",
        borderRadius:8,
        backgroundColor: colors.brandHighlight,
        paddingHorizontal:8,
        paddingVertical:4,
    },

    pillText:{
        color: colors.secondary,
        fontSize:11,
        fontWeight:"bold",
    },

});