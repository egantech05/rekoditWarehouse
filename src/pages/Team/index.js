import { View, Text, ScrollView } from "react-native";
import React, { useMemo, useState } from "react";



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

  const { user, currentWarehouse, teamMembers, teamMembersLoading, teamMembersError, isAdmin, setTeamMembers, reloadCurrentWarehouseData } = useAuth();

  const warehouseId = currentWarehouse?.id ?? null;

  const [membersError, setMembersError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [memberActionLoadingId, setMemberActionLoadingId] = useState(null);

  const [editingMemberId, setEditingMemberId] = useState(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");



  const normalizedSearch = searchText.trim().toLowerCase();

  const filteredMembers = useMemo(() => {
    if (!normalizedSearch) return teamMembers;

    return teamMembers.filter((m) => {
      const name = String(m?.full_name ?? "").toLowerCase();
      const role = String(m?.role ?? "").toLowerCase();
      const email = String(m?.email ?? "").toLowerCase();
      return name.includes(normalizedSearch) || email.includes(normalizedSearch) || role.includes(normalizedSearch);
    });
  }, [teamMembers, normalizedSearch]);


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

      setTeamMembers((prev) =>
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

      setTeamMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
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
      await reloadCurrentWarehouseData();
    } catch (e) {
      setInviteError(e?.message ?? "Failed to add member.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <View style={TeamStyles.container}>
    <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search" />
    {isAdmin ? <AddCard onPress={() => setShowAddMember(true)} disabled={!warehouseId} /> : null}
      <ScrollView style={TeamStyles.scroll} showsVerticalScrollIndicator={false}>
        {!!(membersError || teamMembersError) && (
          <Text style={{ color: colors.red, marginBottom: 8 }}>{membersError || teamMembersError}</Text>
        )}

        {!warehouseId ? (
          <Text style={{ color: colors.greyText,  alignSelf:"center" }}>No warehouse selected.</Text>
        ) : teamMembersLoading && teamMembers.length === 0 ? (
          <Text style={{ color: colors.greyText, alignSelf:"center" }}>Loading team...</Text>
        ) : filteredMembers.length === 0 ? (
          <Text style={{ color: colors.greyText, alignSelf:"center" }}>No members found.</Text>
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