import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../../../../../assets/styles";

import InfoBox from "../../../../../../components/InfoBox"


export default function InfoTab() {
  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.counterText}>100</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>
          <InfoBox title="Prop 1" value="Value1"/>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    flex:1, 
  },
  counter: {

    backgroundColor: colors.boldColor,
    borderRadius: 8,
    alignItems: "center",
    padding: 16,

  },

  counterText:{
    fontSize: 24,
    fontWeight: "bold",
    color: colors.brandHighlight,
  },
  text: {
    color: colors.boldColor,
  },
});