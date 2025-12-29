import {StyleSheet} from "react-native";

import {colors} from "../../../../assets/styles"


export const ViewItemStyles= StyleSheet.create({

    container:{
        backgroundColor: colors.bright,
        padding: 16,
        flex:1,

    },

    tabs:{
        paddingVertical: 4,
        paddingHorizontal: 16,
        backgroundColor: colors.brightDarker,
        flexDirection: "row",
        justifyContent:"space-between",
      },




});