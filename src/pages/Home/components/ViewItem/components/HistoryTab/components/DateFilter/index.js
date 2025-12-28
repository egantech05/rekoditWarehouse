import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { DatePickerModal } from "react-native-paper-dates";

import { colors } from "../../../../../../../../assets/styles";
import FooterTextButton from "../../../../../../../../components/FooterTextButton";

export default function DateFilter({
  visible,
  onClose,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onClear,
}) {
  const [error, setError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      setError("");
      setPickerOpen(false);
    }
  }, [visible]);

  const fmt = (d) => (d ? d.toLocaleDateString() : "Any");

  const validate = () => {
    if (startDate && endDate && startDate > endDate) {
      setError("Start date must be before end date.");
      return false;
    }
    setError("");
    return true;
  };

  const applyAndClose = () => {
    if (!validate()) return;
    onClose?.();
  };

  const titleText = useMemo(() => {
    if (!startDate && !endDate) return "Pick a date range";
    if (startDate && !endDate) return `From ${fmt(startDate)}`;
    if (!startDate && endDate) return `Until ${fmt(endDate)}`;
    return `${fmt(startDate)} → ${fmt(endDate)}`;
  }, [startDate, endDate]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Date Range</Text>

          <Pressable
            style={styles.row}
            onPress={() => {
              setError("");
              setPickerOpen(true);
            }}
          >
            <Text style={styles.label}>Range</Text>
            <Text style={styles.value}>{titleText}</Text>
          </Pressable>

          {/* Paper Dates range picker (cross-platform) */}
          <DatePickerModal
            locale="en" // change if you want, e.g. "en-GB"
            mode="range"
            visible={pickerOpen}
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
            onDismiss={() => setPickerOpen(false)}
            onConfirm={({ startDate: s, endDate: e }) => {
              setPickerOpen(false);
              setError("");

              // react-native-paper-dates returns Date | undefined
              const nextStart = s ?? null;
              const nextEnd = e ?? null;

              // Keep your existing prop API (separate callbacks)
              onChangeStartDate?.(nextStart);
              onChangeEndDate?.(nextEnd);
            }}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.footer}>
            <FooterTextButton
              text="Clear"
              color={colors.brightDarker}
              textColor={colors.boldColor}
              onPress={() => {
                onClear?.();
                setError("");
              }}
            />
            <FooterTextButton
              text="Done"
              color={colors.boldColor}
              textColor={colors.brandHighlight}
              onPress={applyAndClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  scrim: { flex: 1 },
  sheet: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 12,
  },
  title: { color: colors.boldColor, fontWeight: "bold", fontSize: 16 },
  row: {
    borderWidth: 1,
    borderColor: colors.brightOutline,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  label: { color: colors.tertiary },
  value: { color: colors.boldColor, fontWeight: "bold", marginLeft: 12, flexShrink: 1, textAlign: "right" },
  error: { color: colors.red },
  footer: { flexDirection: "row", gap: 12, marginTop: 4 },
});