import { View,Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {EditTeamStyles} from "./styles";
import { colors } from "../../../../assets/styles";

export default function EditTeamMember(){
    return(
        <View style={EditTeamStyles.container}>
            <Pressable style={EditTeamStyles.editRoles}><Text style={EditTeamStyles.roles}>Member</Text></Pressable>
            <Pressable style={EditTeamStyles.remove}>
                <Ionicons name="trash-outline" size={24} color={colors.red} />
            </Pressable>
        </View>
    );
};