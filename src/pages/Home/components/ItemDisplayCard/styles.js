import { StyleSheet } from "react-native";

import {colors} from "../../../../assets/styles"


export const ItemDisplayCardStyles= StyleSheet.create({
    container:{
        width: 160,
        height:160,
        borderRadius: 16,
        padding: 8,
        backgroundColor: "white",
        justifyContent:"space-between"

    },

    topSection:{
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    quantityPill:{
        alignItems: "center",
        backgroundColor: colors.boldColor,
        borderRadius: 8,
        paddingHorizontal:8,
        paddingVertical:4,
    },
    quantityPillText:{
        
        justifyContent:"center",
        color: colors.brandHighlight,
        fontSize: 16,
        fontWeight:"bold",
    },
    bottomSection:{
         gap: 8,
    },
    title:{
        fontSize: 24,
        fontWeight: "bold",
        color: colors.secondary,
        
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
        fontSize:12,
        fontWeight:"bold",
    },

});