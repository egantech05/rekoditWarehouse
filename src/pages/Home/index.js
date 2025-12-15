import { View, Text, StyleSheet, ScrollView } from "react-native";

import { HomeStyles } from "./styles";

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

