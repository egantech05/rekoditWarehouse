import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const DropDownStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: colors.brightOutline,
        paddingVertical: 8,
        paddingHorizontal:16,
        borderRadius: 8,
     
      },

      title:{
        fontSize: 11,
        color: colors.greyText,
      },

      inputBox:{
        flexDirection: "row",
      },

      input:{
        flex:1,
        marginVertical: 8,
        fontSize: 13,
        fontWeight: "bold",
        marginLeft: 8,
      }


});