import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const InfoBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
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
        fontSize: 16,
        color: colors.boldColor,
        padding:8,
        fontWeight: "bold",
      },
});

