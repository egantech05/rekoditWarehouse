import { restRequest } from "../supabase";


export const TEAM_MEMBERS_PAGE_SIZE = 50;

export async function fetchTeamMembersPage({ warehouseId, from = 0, to = TEAM_MEMBERS_PAGE_SIZE - 1 }) {
  if (!warehouseId) return { members: [], nextFrom: from };

  const limit = to - from + 1;
  const memberRows = await restRequest({
    path: "warehouse_members",
    params: {
      select: "user_id,role",
      warehouse_id: `eq.${warehouseId}`,
      order: "user_id.asc",
      limit: String(limit),
      offset: String(from),
    },
  });

  const membersList = Array.isArray(memberRows) ? memberRows : [];
  const userIds = [...new Set(membersList.map((r) => r?.user_id).filter(Boolean))];

  let profilesById = {};
  if (userIds.length) {
    const profiles = await restRequest({
      path: "profiles",
      params: {
        select: "user_id,full_name,email",
        user_id: `in.(${userIds.join(",")})`,
      },
    });

    if (Array.isArray(profiles)) {
      profilesById = Object.fromEntries((profiles ?? []).map((p) => [p.user_id, p]));
    }
  }

  const members = membersList.map((m) => ({
    ...m,
    full_name: profilesById[m.user_id]?.full_name ?? "",
    email: profilesById[m.user_id]?.email ?? "",
  }));

  return { members, nextFrom: from + membersList.length };
}

