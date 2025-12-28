import { View, Text, ScrollView } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { TeamStyles } from "./styles";
import TeamMember from "./components/TeamMember"
import EditTeamMember from "./components/EditTeamMember"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard";
import SmallModal from "../../components/SmallModal";

import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabase";
import { colors } from "../../assets/styles";

export default function Team() {

  const { user, warehouseSelection } = useAuth();
  const warehouseId = warehouseSelection?.id ?? null;

  const [isAdmin, setIsAdmin] = useState(false);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [memberActionLoadingId, setMemberActionLoadingId] = useState(null);

  const [editingMemberId, setEditingMemberId] = useState(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");

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

  const loadMembers = useCallback(async () => {
    if (!warehouseId) {
      setMembers([]);
      setMembersError("");
      return;
    }

    setLoadingMembers(true);
    setMembersError("");
    try {
      const { data: memberRows, error } = await supabase
        .from("warehouse_members")
        .select("user_id, role")
        .eq("warehouse_id", warehouseId);

      if (error) throw error;

      const rows = (memberRows ?? []).filter((r) => r?.user_id && r.user_id !== user?.id);
      const userIds = [...new Set(rows.map((r) => r?.user_id).filter(Boolean))];

      let profilesById = {};
      if (userIds.length) {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);

        if (!profileError) {
          profilesById = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p]));
        }
      }

      setMembers(
        rows.map((m) => ({
          ...m,
          full_name: profilesById[m.user_id]?.full_name ?? "",
          email: profilesById[m.user_id]?.email ?? "",
        }))
      );
    } catch (e) {
      console.warn("loadMembers failed:", e);
      setMembersError(e?.message ?? "Failed to load team.");
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [warehouseId, user?.id]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredMembers = useMemo(() => {
    if (!normalizedSearch) return members;

    return members.filter((m) => {
      const name = String(m?.full_name ?? "").toLowerCase();
      const role = String(m?.role ?? "").toLowerCase();
      const email = String(m?.email ?? "").toLowerCase();
      return name.includes(normalizedSearch) || email.includes(normalizedSearch) || role.includes(normalizedSearch);
      
    });
  }, [members, normalizedSearch]);

  const onToggleMemberRole = async (member) => {
    if (!isAdmin || !warehouseId || !member?.user_id) return;

    const currentRole = String(member.role ?? "").toLowerCase();
    const nextRole = currentRole === "admin" ? "member" : "admin";

    setMemberActionLoadingId(member.user_id);
    setMembersError("");
    try {
      const { error } = await supabase
        .from("warehouse_members")
        .update({ role: nextRole })
        .eq("warehouse_id", warehouseId)
        .eq("user_id", member.user_id);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) => (m.user_id === member.user_id ? { ...m, role: nextRole } : m))
      );

      setEditingMemberId(null);
    } catch (e) {
      setMembersError(e?.message ?? "Failed to update role.");
    } finally {
      setMemberActionLoadingId(null);
    }
  };

  const onRemoveMember = async (member) => {
    if (!isAdmin || !warehouseId || !member?.user_id) return;
    if (member.user_id === user?.id) {
      setMembersError("You can't remove yourself.");
      return;
    }

    setMemberActionLoadingId(member.user_id);
    setMembersError("");
    try {
      const { error } = await supabase
        .from("warehouse_members")
        .delete()
        .eq("warehouse_id", warehouseId)
        .eq("user_id", member.user_id);

      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
      setEditingMemberId(null);
    } catch (e) {
      setMembersError(e?.message ?? "Failed to remove member.");
    } finally {
      setMemberActionLoadingId(null);
    }
  };

  const onAddMember = async () => {
    setInviteError("");
  
    const email = (inviteEmail ?? "").trim().toLowerCase();
    if (!email) return setInviteError("Please enter an email.");
    if (!isAdmin) return setInviteError("Admins only.");
    if (!warehouseId) return setInviteError("No warehouse selected.");
  
    setInviteLoading(true);
    try {
      const { error } = await supabase.rpc("add_warehouse_member_by_email", {
        p_warehouse_id: warehouseId,
        p_email: email,
      });
      
      if (error) {
        const msg = (error.message ?? "").toLowerCase();
        if (msg.includes("user_not_found")) return setInviteError("User not found. Ask them to sign up first.");
        if (msg.includes("not_admin")) return setInviteError("Admins only.");
        throw error;
      }
  
      setShowAddMember(false);
      setInviteEmail("");
      await loadMembers();
    } catch (e) {
      setInviteError(e?.message ?? "Failed to add member.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <View style={TeamStyles.container}>
    <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search team" />
    {isAdmin ? <AddCard onPress={() => setShowAddMember(true)} disabled={!warehouseId} /> : null}
      <ScrollView style={TeamStyles.scroll} showsVerticalScrollIndicator={false}>
        {!!membersError && <Text style={{ color: colors.red, marginBottom: 8 }}>{membersError}</Text>}

        {!warehouseId ? (
          <Text style={{ color: colors.greyText }}>No warehouse selected.</Text>
        ) : loadingMembers ? (
          <Text style={{ color: colors.greyText }}>Loading team...</Text>
        ) : filteredMembers.length === 0 ? (
          <Text style={{ color: colors.greyText }}>No members found.</Text>
        ) : (
          filteredMembers.map((m) => (
            <View key={m.user_id}>
            <TeamMember
                fullName={m.full_name}
                email={m.email}
                role={m.role}
                canEdit={isAdmin}
                onPressRole={
                  isAdmin
                    ? () => setEditingMemberId((prev) => (prev === m.user_id ? null : m.user_id))
                    : undefined
                }
      
              />

              {isAdmin && editingMemberId === m.user_id ? (
                <EditTeamMember
                  canEdit={isAdmin}
                  role={m.role}
                  disabled={memberActionLoadingId === m.user_id}
                  onToggleRole={() => onToggleMemberRole(m)}
                  onRemove={() => onRemoveMember(m)}
                />
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      <SmallModal
        visible={showAddMember}
        onClose={() => {
          setShowAddMember(false);
          setInviteEmail("");
          setInviteError("");
        }}
        title="Add Member"
        inputTitle="User email"
        value={inviteEmail}
        onChangeText={(t) => {
          setInviteEmail(t);
          if (inviteError) setInviteError("");
        }}
        placeholder="name@email.com"
        submitText="Add"
        onSubmit={onAddMember}
        loading={inviteLoading}
        error={inviteError}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
    </View>
  );
};