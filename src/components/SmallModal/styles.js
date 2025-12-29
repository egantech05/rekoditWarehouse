import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const SmallModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
 
  },

  sheet: {
    backgroundColor: colors.bright,
    borderRadius:16,
    width: "80%",
 
  },

  header: {
    borderBottomWidth: 1,
    borderColor: colors.brightOutline,
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.boldColor,
  },

  body: {
    padding: 16,
  },

  validationAlert: {
    color: colors.red,
    marginLeft: 18,
    marginTop: 8,
  },

  footer: {
    justifyContent: "flex-end",
    borderTopWidth: 1,
    padding: 16,
    borderColor: colors.brightOutline,
    flexDirection: "row",
    gap: 8,
  },
});