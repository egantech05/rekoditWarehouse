
import { View, Text,TextInput, StyleSheet,Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../../../../assets/styles"

export default function QuantityEdit(){

    return(
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <Pressable style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></Pressable>
                <TextInput style={styles.input}></TextInput>
                <Pressable style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
            </View>
            <Pressable style={styles.confirm}>
                <Ionicons name="checkmark-outline" size={24} color={colors.brandHighlight} />
            </Pressable>
        </View>
    );

};

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        flex:1,
    },

    inputBox:{
        backgroundColor: "white",
        flexDirection: "row",
        flex:1,
        borderWidth:3,
        borderColor: colors.brightDarker,
        borderRadius:16,
    },

    qtyBtn:{
        borderRadius:8,
        paddingVertical: 16,
        paddingHorizontal:24,
        backgroundColor: colors.boldColor,
    
    },

    qtyBtnText:{
        color: colors.brandHighlight,
        fontSize:24,
        fontWeight:"bold",
    },

    input:{
        outlineStyle: 'none',
        fontSize: 24,
        color: colors.boldColor,
        padding:8,
        fontWeight: "bold",
        flex:1,
        alignSelf: "center",
        textAlign: "center",

    },

    confirm:{
        borderRadius:8,
        paddingHorizontal:24,
        backgroundColor: colors.boldColor,
        marginLeft:8,
        justifyContent: "center",       
    },
});