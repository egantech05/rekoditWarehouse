import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const TemplateStyles = StyleSheet.create({
  container: {

    backgroundColor: colors.body,
    flex:1,

   },

   scroll:{
    flexGrow: 1,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    alignItems: "flex-start",
   },

});