import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../assets/styles";

import ItemDisplayCard from "./components/ItemDisplayCard"

export default function Home() {
  return (
    <ScrollView
      contentContainerStyle={HomeStyles.container}
      showsVerticalScrollIndicator={false}
    >
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
                <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
        <ItemDisplayCard/>
    </ScrollView>
  );
}

const HomeStyles = StyleSheet.create({
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