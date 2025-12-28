import { StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export const HomeStyles = StyleSheet.create({
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

   emptyState: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  emptyTitle: {
    color: colors.bright,
    fontSize: 18,
    fontWeight: "bold",
  },

  emptyBody: {
    color: colors.greyText,
    textAlign: "center",
  },

  createWarehouseLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  createWarehouseText: {
    color: colors.brandHighlight,
    fontWeight: "bold",
  },

  loadingText: {
    color: colors.bright,
    fontWeight: "bold",
  },

  itemsEmptyText: {
    width: "100%",
    textAlign: "center",
    color: colors.greyText,
    paddingTop: 24,
  },

  templateNotice:{
    paddingTop: 24,
    marginHorizontal:16,
    textAlign: "center",
    color: colors.greyText,
  },

});