import { View, Text, ScrollView,Modal,Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ViewModalStyles } from "./styles";
import {colors} from "../../assets/styles"

export default function ViewModal({ visible, onClose,title, children, footer }) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={ViewModalStyles.container} >
          <View style={ViewModalStyles.sheet}>
            <View style={ViewModalStyles.header}>
                <Text style={ViewModalStyles.headerText}>{title}</Text>
                <Pressable onPress={onClose}>
                  <Ionicons name="close-outline" size={24} color={colors.boldColor} />
                </Pressable>
            </View>
            <ScrollView style={ViewModalStyles.body}  showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
            {footer && <View style={ViewModalStyles.footer}>{footer}</View>}
        
          </View>
        </View>
      </Modal>
    );
  }