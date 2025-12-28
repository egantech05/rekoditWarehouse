import { View, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../assets/styles";
import { SmallModalStyles } from "./styles";

import InputBox from "../InputBox";
import FooterTextButton from "../FooterTextButton";

export default function SmallModal({
  visible,
  onClose,
  title = "New",
  inputTitle = "Name",
  value,
  onChangeText,
  placeholder,
  submitText = "Submit",
  onSubmit,
  loading = false,
  disabled = false,
  error = "",
  autoCapitalize = "words",
  autoCorrect = false,
  keyboardType,
  secureTextEntry,
  textContentType,
  showInput = true,
  bodyText = "",
  showCancel = false,
  cancelText = "Cancel",
  onCancel,
}) {
  const isDisabled = disabled || loading;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={SmallModalStyles.container}>
        <View style={SmallModalStyles.sheet}>
          <View style={SmallModalStyles.header}>
            <Text style={SmallModalStyles.headerText}>{title}</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close-outline" size={24} color={colors.boldColor} />
            </Pressable>
          </View>

        <View style={SmallModalStyles.body}>
            {showInput ? (
            <InputBox
                title={inputTitle}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                textContentType={textContentType}
            />
            ) : bodyText ? (
            <Text style={{ color: colors.boldColor }}>{bodyText}</Text>
            ) : null}

            {!!error && <Text style={SmallModalStyles.validationAlert}>{error}</Text>}
        </View>

          <View style={SmallModalStyles.footer}>
             {showCancel ? (
                <FooterTextButton
                    text={cancelText}
                    color={colors.brightDarker}
                    textColor={colors.boldColor}
                    onPress={onCancel ?? onClose}
                    disabled={isDisabled}
                />
                ) : null}
            <FooterTextButton
              text={loading ? "Submitting..." : submitText}
              color={colors.boldColor}
              textColor={colors.brandHighlight}
              onPress={onSubmit}
              disabled={isDisabled}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
