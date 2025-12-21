import { View,Text, Pressable } from "react-native";

import {TeamMemberStyles} from "./styles"

export default function TeamMember(){
    return(
        <View style={TeamMemberStyles.container}>
            <View>
                <Text style={TeamMemberStyles.name}>FirstName Last</Text>
                <Text style={TeamMemberStyles.email}>email@gmail.com</Text>
            </View>
            <Pressable style={TeamMemberStyles.roles}>
                <Text style={TeamMemberStyles.rolesText}>Admin</Text>
            </Pressable>
        </View>
    );
};