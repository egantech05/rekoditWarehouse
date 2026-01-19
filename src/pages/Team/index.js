import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";

import { fetchTeamMembersPage, TEAM_MEMBERS_PAGE_SIZE } from "../../lib/api/teamMembers";



import { TeamStyles } from "./styles";
import TeamMember from "./components/TeamMember"
import EditTeamMember from "./components/EditTeamMember"
import SearchBar from "../../components/SearchBar"
import AddCard from "../../components/AddCard";
import SmallModal from "../../components/SmallModal";

import { useAuth } from "../../auth/AuthContext";
import { refreshSessionOrThrow, restRequest } from "../../lib/supabase";


import { colors } from "../../assets/styles";

export default function Team() {

  const { user, currentWarehouse, teamMembers, teamMembersLoading, teamMembersError, isAdmin, setTeamMembers, reloadCurrentWarehouseData } = useAuth();

  const warehouseId = currentWarehouse?.id ?? null;

  const [membersError, setMembersError] = useState("");

  const [membersPaging, setMembersPaging] = useState(false);
  const [membersPagingError, setMembersPagingError] = useState("");
  const [membersNextFrom, setMembersNextFrom] = useState(0);
  const [hasMoreMembers, setHasMoreMembers] = useState(true);
  const membersPagingInitRef = useRef(false);

  useEffect(() => {
    refreshSessionOrThrow();
  }, []);

  useEffect(() => {
    if (!warehouseId) {
      membersPagingInitRef.current = false;
      setMembersNextFrom(0);
      setHasMoreMembers(false);
      setMembersPagingError("");
      return;
    }

    if (teamMembersLoading || membersPagingInitRef.current) return;

    const count = teamMembers.length;
    setMembersNextFrom(count);
    setHasMoreMembers(count === TEAM_MEMBERS_PAGE_SIZE);
    membersPagingInitRef.current = true;
  }, [warehouseId, teamMembersLoading, teamMembers.length]);


  const [searchText, setSearchText] = useState("");
  const [memberActionLoadingId, setMemberActionLoadingId] = useState(null);

  const [editingMemberId, setEditingMemberId] = useState(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");



  const normalizedSearch = searchText.trim().toLowerCase();

  const filteredMembers = useMemo(() => {
    const visibleMembers = teamMembers.filter((m) => m?.user_id !== user?.id);
    if (!normalizedSearch) return visibleMembers;

    return visibleMembers.filter((m) => {
      const name = String(m?.full_name ?? "").toLowerCase();
      const role = String(m?.role ?? "").toLowerCase();
      const email = String(m?.email ?? "").toLowerCase();
      return name.includes(normalizedSearch) || email.includes(normalizedSearch) || role.includes(normalizedSearch);
    });
  }, [teamMembers, normalizedSearch, user?.id]);



  const onToggleMemberRole = async (member) => {
    if (!isAdmin || !warehouseId || !member?.user_id) return;

    const currentRole = String(member.role ?? "").toLowerCase();
    const nextRole = currentRole === "admin" ? "member" : "admin";

    setMemberActionLoadingId(member.user_id);
    setMembersError("");
    try {
      await refreshSessionOrThrow();

      await restRequest({
        method: "PATCH",
        path: "warehouse_members",
        params: {
          warehouse_id: `eq.${warehouseId}`,
          user_id: `eq.${member.user_id}`,
        },
        body: { role: nextRole },
      });


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
      await refreshSessionOrThrow();
      await restRequest({
        method: "DELETE",
        path: "warehouse_members",
        params: {
          warehouse_id: `eq.${warehouseId}`,
          user_id: `eq.${member.user_id}`,
        },
      });


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
      await refreshSessionOrThrow();

      await restRequest({
        method: "POST",
        path: "rpc/add_warehouse_member_by_email",
        body: {
          p_warehouse_id: warehouseId,
          p_email: email,
        },
      });

  
      setShowAddMember(false);
      setInviteEmail("");
      await onReloadMembers();
    } catch (e) {
      const msg = (e?.message ?? "").toLowerCase();
      if (msg.includes("user_not_found")) return setInviteError("User not found. Ask them to sign up first.");
      if (msg.includes("not_admin")) return setInviteError("Admins only.");
      setInviteError(e?.message ?? "Failed to add member.");
    } finally {

      setInviteLoading(false);
    }
  };

  const onReloadMembers = useCallback(() => {
    membersPagingInitRef.current = false;
    setMembersNextFrom(0);
    setHasMoreMembers(true);
    setMembersPagingError("");
    return reloadCurrentWarehouseData();
  }, [reloadCurrentWarehouseData]);

  const onLoadMoreMembers = useCallback(async () => {
    if (!warehouseId || teamMembersLoading || membersPaging || !hasMoreMembers) return;

    setMembersPaging(true);
    setMembersPagingError("");
    try {
      const { members: pageMembers, nextFrom } = await fetchTeamMembersPage({
        warehouseId,
        from: membersNextFrom,
        to: membersNextFrom + TEAM_MEMBERS_PAGE_SIZE - 1,
      });

      setTeamMembers((prev) => {
        const byId = new Map(prev.map((m) => [m.user_id, m]));
        for (const row of pageMembers ?? []) {
          const existing = byId.get(row.user_id);
          byId.set(row.user_id, existing ? { ...existing, ...row } : row);
        }
        return Array.from(byId.values());
      });

      const loadedCount = pageMembers?.length ?? 0;
      setMembersNextFrom(nextFrom ?? membersNextFrom + loadedCount);
      setHasMoreMembers(loadedCount === TEAM_MEMBERS_PAGE_SIZE);
    } catch (e) {
      setMembersPagingError(e?.message ?? "Failed to load more members.");
    } finally {
      setMembersPaging(false);
    }
  }, [warehouseId, teamMembersLoading, membersPaging, hasMoreMembers, membersNextFrom, setTeamMembers]);


  return (
    <View style={TeamStyles.container}>
    <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search" />
    {isAdmin ? <AddCard onPress={() => setShowAddMember(true)} disabled={!warehouseId} /> : null}
      <ScrollView style={TeamStyles.scroll} showsVerticalScrollIndicator={false}>
      {!!(membersError || teamMembersError || membersPagingError) && (
        <Text style={{ color: colors.red, marginBottom: 8 }}>
          {membersError || teamMembersError || membersPagingError}
        </Text>
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
                {hasMoreMembers && !teamMembersLoading && filteredMembers.length > 0 && (
          <Pressable onPress={onLoadMoreMembers} disabled={membersPaging}>
            <Text style={{ color: colors.greyText, alignSelf: "center", paddingVertical: 8 }}>
              {membersPaging ? "Loading more..." : "Load more"}
            </Text>
          </Pressable>
        )}
        {!!membersPagingError && (
          <Text style={{ color: colors.red, alignSelf: "center" }}>{membersPagingError}</Text>
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