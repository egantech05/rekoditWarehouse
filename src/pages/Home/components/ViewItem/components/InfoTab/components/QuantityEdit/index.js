
import { View, Text,TextInput, StyleSheet,Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {colors} from "../../../../../../../../assets/styles"

export default function QuantityEdit({ value = 0, onChange, onSubmit, disabled = false }) {

    return(
        <View style={styles.container}>
            <View style={styles.inputBox}>
            <Pressable
            style={styles.qtyBtn}
            disabled={disabled}
            onPress={() => onChange?.(Number(value) - 1)}
            >
            <Text style={styles.qtyBtnText}>-</Text>
            </Pressable>

            <TextInput
            style={styles.input}
            value={String(value)}
            keyboardType="numbers-and-punctuation"
            editable={!disabled}
            onChangeText={(t) => {
            const next = parseInt(t, 10);
            onChange?.(Number.isFinite(next) ? next : 0);
            }}
            />

            <Pressable
            style={styles.qtyBtn}
            disabled={disabled}
            onPress={() => onChange?.(Number(value) + 1)}
            >
            <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
            </View>
            <Pressable style={styles.confirm} disabled={disabled} onPress={onSubmit}>
            <Ionicons name="checkmark-outline" size={16} color={colors.brandHighlight} />
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
        flexShrink:1,
        minWidth:0,
    },

    qtyBtn:{
        borderRadius:8,
        paddingVertical: 16,
        paddingHorizontal:12,
        backgroundColor: colors.boldColor,
        alignItems:"center",
        justifyContent:"center"
    
    },

    qtyBtnText:{
        color: colors.brandHighlight,
        fontSize:16,
        fontWeight:"bold",
    },

    input:{
        outlineStyle: 'none',
        fontSize: 16,
        color: colors.boldColor,
        padding:8,
        fontWeight: "bold",
        flex:1,
        alignSelf: "center",
        textAlign: "center",
        minWidth: 0,

    },

    confirm:{
        borderRadius:8,
        paddingHorizontal:12,
        backgroundColor: colors.boldColor,
        marginLeft:8,
        justifyContent: "center",       
        minWidth: 44,
    },
});