import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../../../../../assets/styles";

import InfoBox from "../../../../../../components/InfoBox"
import InputBox from "../../../../../../components/InputBox";


export default function InfoTab({ item, isEditing = false, draftProperties = {}, setDraftProperties }) {
  const templateProps = Array.isArray(item?.templates?.template_properties)
    ? item.templates.template_properties
    : [];

  const valueMap = Array.isArray(item?.item_property_values)
    ? Object.fromEntries(
        item.item_property_values.map((v) => [v?.property_id, v?.value])
      )
    : {};

  const orderedDisplayEntries = templateProps.map((p) => [
    p?.id,
    p?.name ?? "",
    valueMap?.[p?.id] ?? null,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.counterText}>{String(item?.quantity ?? 0)}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isEditing
          ? templateProps.map((p, idx) => (
              <InputBox
                key={p?.id ?? idx}
                title={p?.name ?? `Property ${idx + 1}`}
                value={draftProperties?.[p?.id] ?? ""}
                onChangeText={(t) => setDraftProperties?.((prev) => ({ ...(prev ?? {}), [p?.id]: t }))}
              />
            ))
          : orderedDisplayEntries.map(([id, name, value], idx) => (
              <InfoBox
                key={id ?? idx}
                title={name || `Property ${idx + 1}`}
                value={value == null || String(value).trim() === "" ? "—" : String(value)}
              />
            ))}
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