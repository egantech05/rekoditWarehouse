import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const HomeStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.body,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    alignItems: "flex-start",
   },

});