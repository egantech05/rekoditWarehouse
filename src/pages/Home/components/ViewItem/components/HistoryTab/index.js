import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../../../../../assets/styles"

import LogDisplay from "./components/LogDisplay";

export default function HistoryTab() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />
      <LogDisplay />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap:4,
  },

});