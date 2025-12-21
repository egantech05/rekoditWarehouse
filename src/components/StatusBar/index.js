import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { statusBarStyles } from "./styles";


export default function StatusBar(){
    return(
    <View style={statusBarStyles.container}>
        <View style={statusBarStyles.warehouse}>
            
            <Ionicons name= "folder-outline" size={16} color="white" />
            <View ><Text style={statusBarStyles.warehouseName}>Warehouse 1</Text></View>
        </View>
        <View style={statusBarStyles.user}>
            <View ><Text style={statusBarStyles.userName}>User</Text></View>
            <Ionicons name= "person-circle-outline" size={24} color="white" />
        </View>
        
    </View>

    );

}