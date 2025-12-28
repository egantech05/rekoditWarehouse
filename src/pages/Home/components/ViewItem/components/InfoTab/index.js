import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../../../../../assets/styles";

import InfoBox from "../../../../../../components/InfoBox"
import InputBox from "../../../../../../components/InputBox";


export default function InfoTab({ item, isEditing = false, draftProperties = {}, setDraftProperties }) {
  const templateKeys = Array.isArray(item?.templates?.properties) ? item.templates.properties : [];

  const orderedDisplayEntries =
    item?.properties && typeof item.properties === "object"
      ? templateKeys.length
        ? [
            ...templateKeys.map((k) => [k, item.properties[k]]),
            ...Object.entries(item.properties).filter(([k]) => !templateKeys.includes(k)),
          ]
        : Object.entries(item.properties)
      : [];

  const orderedDraftKeys = templateKeys.length
    ? [
        ...templateKeys.filter((k) => Object.prototype.hasOwnProperty.call(draftProperties ?? {}, k)),
        ...Object.keys(draftProperties ?? {}).filter((k) => !templateKeys.includes(k)),
      ]
    : Object.keys(draftProperties ?? {});

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
      <Text style={styles.counterText}>{String(item?.quantity ?? 0)}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isEditing
          ? orderedDraftKeys.map((k) => (
              <InputBox
                key={k}
                title={k}
                value={draftProperties?.[k] ?? ""}
                onChangeText={(t) => setDraftProperties?.((prev) => ({ ...(prev ?? {}), [k]: t }))}
              />
            ))
          : item?.properties && typeof item.properties === "object"
            ? orderedDisplayEntries
                .filter(([, v]) => v != null && String(v).trim() !== "")
                .map(([k, v]) => <InfoBox key={k} title={k} value={String(v)} />)
            : null}

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
    fontSize: 16,
    fontWeight: "bold",
    color: colors.brandHighlight,
  },
  text: {
    color: colors.boldColor,
  },
});