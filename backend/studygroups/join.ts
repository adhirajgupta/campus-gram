import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface JoinStudyGroupRequest {
  groupId: number;
  userId: number;
}

export interface JoinStudyGroupResponse {
  success: boolean;
  memberCount: number;
}

// Join a study group
export const join = api<JoinStudyGroupRequest, JoinStudyGroupResponse>(
  { expose: true, method: "POST", path: "/study-groups/:groupId/join" },
  async (req) => {
    // Check if already a member
    const existingMember = await universityDB.queryRow`
      SELECT id FROM study_group_members 
      WHERE group_id = ${req.groupId} AND user_id = ${req.userId}
    `;

    if (existingMember) {
      throw APIError.alreadyExists("Already a member");
    }

    // Check group capacity
    const groupInfo = await universityDB.queryRow<{
      maxMembers: number;
      memberCount: number;
    }>`
      SELECT 
        sg.max_members as "maxMembers",
        COALESCE(m.member_count, 0) as "memberCount"
      FROM study_groups sg
      LEFT JOIN (
        SELECT group_id, COUNT(*) as member_count
        FROM study_group_members
        GROUP BY group_id
      ) m ON sg.id = m.group_id
      WHERE sg.id = ${req.groupId}
    `;

    if (!groupInfo) {
      throw APIError.notFound("Study group not found");
    }

    if (groupInfo.memberCount >= groupInfo.maxMembers) {
      throw APIError.resourceExhausted("Study group is full");
    }

    // Add member
    await universityDB.exec`
      INSERT INTO study_group_members (group_id, user_id)
      VALUES (${req.groupId}, ${req.userId})
    `;

    return {
      success: true,
      memberCount: groupInfo.memberCount + 1,
    };
  }
);
