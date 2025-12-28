import { View,Text, Pressable } from "react-native";

import {TeamMemberStyles} from "./styles"

export default function TeamMember({ fullName = "", email = "", role = "member", canEdit = false, onPressRole }) {

    const roleLabel = String(role).toLowerCase() === "admin" ? "Admin" : "Member";
  
    return (
      <View style={TeamMemberStyles.container}>
        <View>
          <Text style={TeamMemberStyles.name}>{fullName || "—"}</Text>
          {!!email && <Text style={TeamMemberStyles.email}>{email}</Text>}
        </View>
  
        <Pressable
            style={TeamMemberStyles.roles}
            onPress={onPressRole}
            disabled={!canEdit || !onPressRole}
            >
          <Text style={TeamMemberStyles.rolesText}>{roleLabel}</Text>
        </Pressable>
      </View>
    );
  }