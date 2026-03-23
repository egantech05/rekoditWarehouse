import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

import {NewItemStyles} from "./styles";
import ViewModal from "../../../../components/ViewModal"
import FooterTextButton from "../../../../components/FooterTextButton";

import {colors} from "../../../../assets/styles"
import Dropdown from "../../../../components/DropDown"
import InputBox from "../../../../components/InputBox"

import { useAuth } from "../../../../auth/AuthContext";
import { createItem } from "../../../../lib/api/items";


export default function NewItemCard({ visible, onClose, warehouseId, onCreated }) {

    const { templates, templatesLoading } = useAuth();


    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplateOptions, setShowTemplateOptions] = useState(false);


    const [propertyValues, setPropertyValues] = useState({});
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");

    const templateProps = Array.isArray(selectedTemplate?.template_properties)
  ? selectedTemplate.template_properties
  : [];

  
    useEffect(() => {
      if (!visible) {
        setShowTemplateOptions(false);
        setSelectedTemplate(null);
      }
    }, [visible]);
  
    const onSelectTemplate = (template) => {
      setSelectedTemplate(template);
      setShowTemplateOptions(false);
      setPropertyValues({});
      setCreateError("");
    };

    const onCreate = async () => {
        if (!selectedTemplate || createLoading) return;
      
        setCreateError("");
        setCreateLoading(true);
      
        try {
          if (!warehouseId) {
            setCreateError("No warehouse connected.");
            return;
          }
      
        
        const properties = {};
        for (const prop of templateProps) {
          const propId = prop?.id;
          if (!propId) continue;
          const raw = propertyValues[propId];
          const trimmed = typeof raw === "string" ? raw.trim() : "";
          properties[propId] = trimmed ? trimmed : null; 
        }
        
      

      
          await createItem({
            warehouseId,
            templateId: selectedTemplate?.id,
            name: selectedTemplate?.name ?? "Inventory",
            quantity: 0,
            properties,
          });
      
          onClose?.();
          try {
            await onCreated?.();
          } catch (e) {

          }
        } catch (e) {
          setCreateError(e?.message ?? "Failed to create item.");
        } finally {
          setCreateLoading(false);
        }
      };

    const footer = (
        <>
        <FooterTextButton
        text={createLoading ? "Creating..." : "Create"}
        color={colors.boldColor}
        textColor={colors.brandHighlight}
        onPress={onCreate}
        disabled={!selectedTemplate || createLoading}
        />
        </>

    );



    return(
        <ViewModal visible={visible} onClose={onClose} title="New Inventory" footer={footer}>
            <ScrollView style={NewItemStyles.container} showsVerticalScrollIndicator={false}>
            
            <Dropdown
            title="Template"
            value={selectedTemplate?.name}
            placeholder="Select Template"
            onPress={() => setShowTemplateOptions((prev) => !prev)}
            />
           

            {showTemplateOptions && (
            <>
            {templatesLoading ? (
                <Text style={{ color: colors.greyText, marginTop: 8 }}>Loading templates...</Text>
            ) : templates.length === 0 ? (
                <Text style={{ color: colors.greyText, marginTop: 8 }}>No templates found.</Text>
            ) : (
                templates.map((t, idx) => (
                <Pressable
                    key={t?.id ?? `${t?.name ?? "template"}-${idx}`}
                    style={{ paddingVertical: 10, paddingHorizontal:24, }}
                    onPress={() => onSelectTemplate(t)}
                >
                    <Text style={{ color: colors.boldColor }}>{t?.name ?? "Template"}</Text>
                </Pressable>
                ))
            )}
            </>
            )}

          {!!selectedTemplate &&
            templateProps.map((prop, idx) => (
              <InputBox
                key={prop?.id ?? `${prop?.name ?? "prop"}-${idx}`}
                title={prop?.name ?? `Property ${idx + 1}`}
                value={propertyValues[prop?.id] ?? ""}
                onChangeText={(t) => {
                  setPropertyValues((prev) => ({ ...prev, [prop?.id]: t }));
                  if (createError) setCreateError("");
                }}
              />
            ))
          }


            {!!createError && <Text style={{ color: colors.red, margin: 8 }}>{createError}</Text>}
            </ScrollView>
      </ViewModal>
    );
};