import { View, ScrollView, Text, Pressable } from "react-native";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";

import { TemplateStyles } from "./styles";

import { fetchTemplatesPage, TEMPLATES_PAGE_SIZE } from "../../lib/api/templates";

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

  const [templatesPaging, setTemplatesPaging] = useState(false);
  const [templatesPagingError, setTemplatesPagingError] = useState("");
  const [templatesNextFrom, setTemplatesNextFrom] = useState(0);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(true);
  const templatesPagingInitRef = useRef(false);

  useEffect(() => {
    if (!warehouseId) {
      templatesPagingInitRef.current = false;
      setTemplatesNextFrom(0);
      setHasMoreTemplates(false);
      setTemplatesPagingError("");
      return;
    }

    if (templatesLoading || templatesPagingInitRef.current) return;

    const count = templates.length;
    setTemplatesNextFrom(count);
    setHasMoreTemplates(count === TEMPLATES_PAGE_SIZE);
    templatesPagingInitRef.current = true;
  }, [warehouseId, templatesLoading, templates.length]);


  const filteredTemplates = useMemo(
    () =>
      filterBySearch(templates, searchText, (t) =>
        buildSearchHaystack(
          t?.name,
          (Array.isArray(t?.template_properties) ? t.template_properties : []).map((p) => p?.name)
        )
      ),
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
      await onReloadTemplates();
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
    .map((p, idx) => {
      if (typeof p === "string") {
        const name = p.trim();
        return { id: null, name, position: idx + 1 };
      }
      return {
        id: p?.id ?? null,
        name: String(p?.name ?? "").trim(),
        position: idx + 1,
      };
    })
    .filter((p) => p.name);
  
  
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

  const onReloadTemplates = useCallback(() => {
    templatesPagingInitRef.current = false;
    setTemplatesNextFrom(0);
    setHasMoreTemplates(true);
    setTemplatesPagingError("");
    return reloadCurrentWarehouseData();
  }, [reloadCurrentWarehouseData]);

  const onLoadMoreTemplates = useCallback(async () => {
    if (!warehouseId || templatesLoading || templatesPaging || !hasMoreTemplates) return;

    setTemplatesPaging(true);
    setTemplatesPagingError("");
    try {
      const { templates: pageTemplates, nextFrom } = await fetchTemplatesPage({
        warehouseId,
        from: templatesNextFrom,
        to: templatesNextFrom + TEMPLATES_PAGE_SIZE - 1,
      });

      setTemplates((prev) => {
        const byId = new Map(prev.map((t) => [t.id, t]));
        for (const row of pageTemplates ?? []) {
          const existing = byId.get(row.id);
          byId.set(row.id, existing ? { ...existing, ...row } : row);
        }
        return Array.from(byId.values());
      });

      const loadedCount = pageTemplates?.length ?? 0;
      setTemplatesNextFrom(nextFrom ?? templatesNextFrom + loadedCount);
      setHasMoreTemplates(loadedCount === TEMPLATES_PAGE_SIZE);
    } catch (e) {
      setTemplatesPagingError(e?.message ?? "Failed to load more templates.");
    } finally {
      setTemplatesPaging(false);
    }
  }, [warehouseId, templatesLoading, templatesPaging, hasMoreTemplates, templatesNextFrom, setTemplates]);



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
            properties={t?.template_properties ?? []}
            onPress={() => {
              setTemplateActionError("");
              setSelectedTemplate(t);
              setShowTemplate(true);
            }}
          />
        ))
      )}

{hasMoreTemplates && !templatesLoading && filteredTemplates.length > 0 && (
        <Pressable onPress={onLoadMoreTemplates} disabled={templatesPaging}>
          <Text style={{ width: "100%", textAlign: "center", color: colors.greyText, paddingTop: 16 }}>
            {templatesPaging ? "Loading more..." : "Load more"}
          </Text>
        </Pressable>
      )}
      {!!templatesPagingError && (
        <Text style={{ width: "100%", textAlign: "center", color: colors.red, paddingTop: 8 }}>
          {templatesPagingError}
        </Text>
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

