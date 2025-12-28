import { View, ScrollView, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { TemplateStyles } from "./styles";

import TemplateDisplayCard from "./components/TemplateDisplayCard"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard"
import NewTemplateCard from "./components/NewTemplateCard";
import ViewTemplate from "./components/ViewTemplate";

import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { colors } from "../../assets/styles";

export default function Templates() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const { user, warehouseSelection } = useAuth();

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

  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredTemplates = normalizedSearch
    ? templates.filter((t) => {
        const name = String(t?.name ?? "").toLowerCase();
        const props = Array.isArray(t?.properties) ? t.properties.join(" ").toLowerCase() : "";
        return name.includes(normalizedSearch) || props.includes(normalizedSearch);
      })
    : templates;

  useEffect(() => {
    let ignore = false;
  
    const loadLatestWarehouse = async () => {
      if (warehouseSelection?.id) {
        setWarehouseId(warehouseSelection.id);
        setLoadingWarehouse(false);
        return;
      }

      if (!user?.id) {
        setWarehouseId(null);
        setTemplates([]);
        return;
      }
  
      setLoadingWarehouse(true);
      try {
        const { data, error } = await supabase
          .from("warehouses")
          .select("id, created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
  
        if (ignore) return;
        if (error) throw error;
  
        setWarehouseId(data?.id ?? null);
      } catch (e) {
        console.warn("loadLatestWarehouse failed:", e);
        if (!ignore) setWarehouseId(null);
      } finally {
        if (!ignore) setLoadingWarehouse(false);
      }
    };
  
    loadLatestWarehouse();
    return () => {
      ignore = true;
    };
  }, [user?.id, warehouseSelection?.id]);

  useEffect(() => {
    let ignore = false;
  
    const loadTemplates = async () => {
      if (!warehouseId) {
        setTemplates([]);
        return;
      }
  
      setLoadingTemplates(true);
      try {
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .eq("warehouse_id", warehouseId);
  
        if (ignore) return;
        if (error) throw error;
  
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
        const { data, error } = await supabase
          .from("warehouse_members") 
          .select("role") 
          .eq("warehouse_id", warehouseId)
          .eq("user_id", user.id)
          .maybeSingle();
  
        if (ignore) return;
        if (error) throw error;
  
        setIsAdmin(data?.role === "admin");
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
      const insertRow = { name: trimmed, warehouse_id: warehouseId, properties };
  
      const { error } = await supabase.from("templates").insert(insertRow);
      if (error) throw error;
  
      setShowNewTemplate(false);
  
      const { data, error: reloadError } = await supabase
        .from("templates")
        .select("*")
        .eq("warehouse_id", warehouseId);
  
      if (reloadError) throw reloadError;
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
      const { data, error } = await supabase
        .from("templates")
        .update({ name: trimmed, properties: trimmedProperties })
        .eq("id", templateId)
        .select("*")
        .maybeSingle();
  
      if (error) throw error;
  
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
      const { error } = await supabase.from("templates").delete().eq("id", templateId);
      if (error) throw error;
  
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
      ) : loadingTemplates ? (
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

