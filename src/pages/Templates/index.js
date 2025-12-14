import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../assets/styles";

export default function Templates() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Template</Text>
      <Text style={styles.subtitle}>Use the NavBar to jump screens.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.body },
  title: { color: colors.brandHighlight, fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { color: "white" },
});