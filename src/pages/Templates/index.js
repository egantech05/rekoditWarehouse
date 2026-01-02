import { View, ScrollView, Text } from "react-native";
import React, { useState, useMemo } from "react";
import { TemplateStyles } from "./styles";

import TemplateDisplayCard from "./components/TemplateDisplayCard"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard"
import NewTemplateCard from "./components/NewTemplateCard";
import ViewTemplate from "./components/ViewTemplate";

import { useAuth } from "../../auth/AuthContext";
import { colors } from "../../assets/styles";

import {  createTemplate, updateTemplate, deleteTemplate } from "../../lib/api/templates";
import { filterBySearch, buildSearchHaystack } from "../../lib/search";


export default function Templates() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const { currentWarehouse, templates, templatesLoading, warehousesLoading, isAdmin, setTemplates, reloadCurrentWarehouseData } = useAuth();
  const warehouseId = currentWarehouse?.id ?? null;

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");


  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [templateActionLoading, setTemplateActionLoading] = useState(false);
  const [templateActionError, setTemplateActionError] = useState("");

  const [searchText, setSearchText] = useState("");

const filteredTemplates = useMemo(
  () => filterBySearch(templates, searchText, (t) => buildSearchHaystack(t?.name, t?.properties)),
  [templates, searchText]
);





  const onCreateTemplate = async (name, properties) => {
    setCreateError("");
    const trimmed = (name ?? "").trim();
  
    if (!trimmed) {
      setCreateError("Please enter a template name.");
      return;
    }
  
    if (!warehouseId) {
      setCreateError("No warehouse connected.");
      return;
    }
  
    setCreateLoading(true);
    try {
      await createTemplate({ warehouseId, name: trimmed, properties });

      setShowNewTemplate(false);
      await reloadCurrentWarehouseData();
    } catch (e) {
      setCreateError(e?.message ?? "Failed to create template.");
    } finally {
      setCreateLoading(false);
    }
  };

  const onUpdateTemplate = async (templateId, name, properties) => {
    setTemplateActionError("");
    const trimmed = (name ?? "").trim();
    const trimmedProperties = (Array.isArray(properties) ? properties : [])
      .map((p) => (p ?? "").trim())
      .filter(Boolean);
  
    if (!templateId) {
      setTemplateActionError("No template selected.");
      return false;
    }
  
    if (!trimmed) {
      setTemplateActionError("Please enter a template name.");
      return false;
    }
  
    setTemplateActionLoading(true);
    try {
      const data = await updateTemplate({ templateId, name: trimmed, properties: trimmedProperties });

      setTemplates((prev) => prev.map((t) => (t.id === templateId ? (data ?? t) : t)));
      setSelectedTemplate((prev) => (prev?.id === templateId ? (data ?? prev) : prev));
      return true;
    } catch (e) {
      setTemplateActionError(e?.message ?? "Failed to update template.");
      return false;
    } finally {
      setTemplateActionLoading(false);
    }
  };
  
  const onDeleteTemplate = async (templateId) => {
    setTemplateActionError("");
  
    if (!templateId) {
      setTemplateActionError("No template selected.");
      return false;
    }
  
    setTemplateActionLoading(true);
    try {
      await deleteTemplate({ templateId });

      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      setSelectedTemplate(null);
      setShowTemplate(false);
      return true;
    } catch (e) {
      setTemplateActionError(e?.message ?? "Failed to delete template.");
      return false;
    } finally {
      setTemplateActionLoading(false);
    }
  };


  return (
    <View style={TemplateStyles.container}>
      <SearchBar value={searchText} onChangeText={setSearchText} />
      <AddCard
        onPress={() => {
          setCreateError("");
          setShowNewTemplate(true);
        }}
        disabled={!warehouseId || warehousesLoading}
      />
      <ScrollView
        contentContainerStyle={TemplateStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
      {!warehouseId && !warehousesLoading ? (
        <Text style={{ width: "100%", textAlign: "center", color: colors.greyText, paddingTop: 24 }}>
          No warehouse connected.
        </Text>
     ) : templatesLoading && templates.length === 0 ? (
        <Text style={{ width: "100%", textAlign: "center", color: colors.greyText, paddingTop: 24 }}>
          Loading templates...
        </Text>
      ) : templates.length === 0 ? (
        <Text style={{ width: "100%", textAlign: "center", color: colors.greyText, paddingTop: 24 }}>
          No templates yet.
        </Text>
      ) : filteredTemplates.length === 0 ? (
        <Text style={{ width: "100%", textAlign: "center", color: colors.greyText, paddingTop: 24 }}>
          No matching templates.
        </Text>
      ) : (
        filteredTemplates.map((t, idx) => (
          <TemplateDisplayCard
            key={t?.id ?? t?.name ?? idx}
            title={t?.name ?? "Template"}
            properties={t?.properties ?? []}
            onPress={() => {
              setTemplateActionError("");
              setSelectedTemplate(t);
              setShowTemplate(true);
            }}
          />
        ))
      )}
      
      </ScrollView>

        <NewTemplateCard
        visible={showNewTemplate}
        onClose={() => {
          setShowNewTemplate(false);
          setCreateError("");
        }}
        onCreate={onCreateTemplate}
        loading={createLoading}
        error={createError}
        />
      <ViewTemplate
        visible={showTemplate}
        onClose={() => {
          setShowTemplate(false);
          setTemplateActionError("");
        }}
        template={selectedTemplate}
        isAdmin={isAdmin}
        loading={templateActionLoading}
        error={templateActionError}
        onUpdate={onUpdateTemplate}
        onDelete={onDeleteTemplate}
      />
    </View>
  );
}

