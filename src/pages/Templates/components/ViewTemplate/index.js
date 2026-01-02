
import {ScrollView,StyleSheet,View,Pressable,Text } from "react-native"; 
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import ViewModal from "../../../../components/ViewModal"

import {colors} from "../../../../assets/styles"
import InfoBox from "../../../../components/InfoBox"
import InputBox from "../../../../components/InputBox";
import AddProperty from "../NewTemplateCard/AddProperty";

import { supabase } from "../../../../lib/supabase";


export default function ViewTemplate({visible, onClose, template, isAdmin, onUpdate, onDelete, loading, error}){

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [properties, setProperties] = useState([""]);

    useEffect(() => {
        if (!visible) {
            setIsEditing(false);
            return;
        }
    
        let ignore = false;
    
        supabase.auth.refreshSession().catch((e) => {
            if (!ignore) console.warn("refreshSession failed:", e);
        });
    

    setIsEditing(false);
    setName(template?.name ?? "");

    const nextProps = Array.isArray(template?.properties) ? template.properties : [];
    setProperties(nextProps.length ? nextProps : [""]);

    return () => {
        ignore = true;
    };


    }, [visible, template?.id]);

    const addProperty = () => setProperties((p) => [...p, ""]);
    const updateProperty = (index, value) =>
    setProperties((p) => p.map((v, i) => (i === index ? value : v)));
    const deleteProperty = (index) =>
    setProperties((p) => (p.length > 1 ? p.filter((_, i) => i !== index) : p));

    const trimmedProperties = properties.map((p) => (p ?? "").trim()).filter(Boolean);

    const footer = null;
    
    const tabs = (
        <View style={styles.tabs}>
            {isAdmin ? (
            <Pressable
                style={styles.button}
                disabled={loading || !template?.id}
                onPress={() => onDelete?.(template?.id)}
            >
                <Ionicons name="trash-outline" size={24} color={colors.red} />
            </Pressable>
            ) : null}
            <Pressable
                style={[styles.button, isEditing && { backgroundColor: colors.boldColor }]}
                disabled={loading || !template?.id || (isEditing && (!name.trim() || trimmedProperties.length === 0))}
                onPress={async () => {
                    if (!isEditing) {
                    setIsEditing(true);
                    return;
                    }

                    const ok = await onUpdate?.(template?.id, name, trimmedProperties);
                    if (ok) setIsEditing(false);
                }}
                >
                <Ionicons
                    name={isEditing ? "save-outline" : "create-outline"}
                    size={24}
                    color={isEditing ? colors.brandHighlight : colors.boldColor}
                />
            </Pressable>
        </View>
    );


    return(
        <ViewModal visible={visible} onClose={onClose} title={template?.name ?? "Template"} tabs ={tabs} footer={footer}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {!!error && <Text style={{ color: colors.red, marginBottom: 8 }}>{error}</Text>}

                {isEditing ? (
                <>
                <InputBox title="Template Name" value={name} onChangeText={setName} />

                {properties.map((prop, idx) => (
                <View key={idx} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ flex: 1 }}>
                    <InputBox
                        title={`Property ${idx + 1}`}
                        value={prop}
                        onChangeText={(t) => updateProperty(idx, t)}
                    />
                    </View>

                    {properties.length > 1 ? (
                    <Pressable onPress={() => deleteProperty(idx)}>
                        <Ionicons name="close-circle-outline" size={24} color={colors.red} />
                    </Pressable>
                    ) : null}
                </View>
                ))}

                <AddProperty onPress={addProperty} />
                </>
                ) : (
                    (Array.isArray(template?.properties) ? template.properties : []).map((p, idx) => (
                        <InfoBox key={`${p}-${idx}`} title={`Property ${idx + 1}`} value={String(p)} />
                    ))
                )}

            </ScrollView>
      </ViewModal>
    );
};

const styles = StyleSheet.create({
    container:{
        padding:16,
    },

    tabs:{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.brightDarker,
        flexDirection: "row",
        justifyContent:"flex-end",
        gap: 8,
      },

      button:{
        backgroundColor: "white",
        borderRadius: 8,   
        paddingVertical:8,
        paddingHorizontal:16,
      },


});