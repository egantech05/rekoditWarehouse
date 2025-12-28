import { View,Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {EditTeamStyles} from "./styles";
import { colors } from "../../../../assets/styles";

export default function EditTeamMember({ canEdit = false, role = "member", onToggleRole, onRemove, disabled = false }) {
    if (!canEdit) return null;
  
    const nextRoleLabel = String(role).toLowerCase() === "admin" ? "Member" : "Admin";
  
    return (
      <View style={EditTeamStyles.container}>
        <Pressable style={EditTeamStyles.editRoles} onPress={onToggleRole} disabled={disabled || !onToggleRole}>
        <Text style={EditTeamStyles.roles}>{nextRoleLabel}</Text>
        </Pressable>
  
        <Pressable style={EditTeamStyles.remove} onPress={onRemove} disabled={disabled || !onRemove}>
          <Ionicons name="trash-outline" size={24} color={colors.red} />
        </Pressable>
      </View>
    );
  }