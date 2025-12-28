import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const InputBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: colors.brightOutline,
        paddingVertical: 8,
        paddingHorizontal:16,
        borderRadius: 8,
        marginTop: 8,
    

    },

    title:{
        fontSize: 11,
        color: colors.greyText,
      },

      input:{
        outlineStyle: 'none',
        fontSize: 13,
        color: colors.boldColor,
        padding:8,
        fontWeight: "bold",
      },
});

