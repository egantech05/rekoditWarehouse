import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../../../assets/styles";

export default function QRTab() {
  return (
    <View style={styles.container}>
      <View style={styles.qr}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },

  qr:{
    backgroundColor: "white",
    padding:16,
    borderRadius:16,
    flex:1,
  },

});