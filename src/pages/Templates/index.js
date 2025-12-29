import { View, ScrollView, Text } from "react-native";
import React, { useState, useEffect, useMemo } from "react";

import { TemplateStyles } from "./styles";

import TemplateDisplayCard from "./components/TemplateDisplayCard"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard"
import NewTemplateCard from "./components/NewTemplateCard";
import ViewTemplate from "./components/ViewTemplate";

import { useAuth } from "../../auth/AuthContext";
import { colors } from "../../assets/styles";

import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate } from "../../lib/api/templates";
import { filterBySearch, buildSearchHaystack } from "../../lib/search";


export default function Templates() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const { user, warehouseSelection, warehouseSelectionLoaded } = useAuth();


  const [warehouseId, setWarehouseId] = useState(null);
  const [loadingWarehouse, setLoadingWarehouse] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [templateActionLoading, setTemplateActionLoading] = useState(false);
  const [templateActionError, setTemplateActionError] = useState("");

  const [searchText, setSearchText] = useState("");

const filteredTemplates = useMemo(
  () => filterBySearch(templates, searchText, (t) => buildSearchHaystack(t?.name, t?.properties)),
  [templates, searchText]
);

useEffect(() => {
  if (!warehouseSelectionLoaded) {
    setLoadingWarehouse(true);
    return;
  }

  setWarehouseId(warehouseSelection?.id ?? null);
  setLoadingWarehouse(false);
}, [warehouseSelectionLoaded, warehouseSelection?.id]);

  useEffect(() => {
    let ignore = false;
  
    const loadTemplates = async () => {
      if (!warehouseId) {
        setTemplates([]);
        return;
      }
  
      setLoadingTemplates(true);
      try {
        const data = await fetchTemplates({ warehouseId });
        if (ignore) return;
        setTemplates(data ?? []);
      } catch (e) {
        console.warn("loadTemplates failed:", e);
        if (!ignore) setTemplates([]);
      } finally {
        if (!ignore) setLoadingTemplates(false);
      }
    };
  
    loadTemplates();
    return () => {
      ignore = true;
    };
  }, [warehouseId]);

  useEffect(() => {
    let ignore = false;
  
    const loadWarehouseRole = async () => {
      if (!user?.id || !warehouseId) {
        setIsAdmin(false);
        return;
      }
  
      try {
        const role = await fetchWarehouseRole({ warehouseId, userId: user.id });
        if (ignore) return;
        setIsAdmin(role === "admin");
      } catch (e) {
        if (!ignore) setIsAdmin(false);
      }
    };
  
    loadWarehouseRole();
    return () => {
      ignore = true;
    };
  }, [user?.id, warehouseId]);

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
      
      const data = await fetchTemplates({ warehouseId });
      setTemplates(data ?? []);
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
        disabled={!warehouseId || loadingWarehouse}
      />
      <ScrollView
        contentContainerStyle={TemplateStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
      {!warehouseId && !loadingWarehouse ? (
        <Text style={{ width: "100%", textAlign: "center", color: colors.greyText, paddingTop: 24 }}>
          No warehouse connected.
        </Text>
     ) : loadingTemplates && templates.length === 0 ? (
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

