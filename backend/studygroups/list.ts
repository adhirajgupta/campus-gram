import { api } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface ListStudyGroupsRequest {
  universityId: number;
  userId?: number;
}

export interface StudyGroup {
  id: number;
  name: string;
  course?: string;
  description?: string;
  maxMembers: number;
  memberCount: number;
  createdAt: Date;
  creator: {
    id: number;
    username: string;
    fullName: string;
  };
  isMember: boolean;
}

export interface ListStudyGroupsResponse {
  studyGroups: StudyGroup[];
}

// Lists study groups for university
export const list = api<ListStudyGroupsRequest, ListStudyGroupsResponse>(
  { expose: true, method: "GET", path: "/study-groups" },
  async (req) => {
    const groups = await universityDB.queryAll<{
      id: number;
      name: string;
      course: string | null;
      description: string | null;
      maxMembers: number;
      createdAt: Date;
      creatorId: number;
      creatorUsername: string;
      creatorFullName: string;
      memberCount: number;
      isMember: number;
    }>`
      SELECT 
        sg.id, sg.name, sg.course, sg.description, sg.max_members as "maxMembers",
        sg.created_at as "createdAt", sg.creator_id as "creatorId",
        u.username as "creatorUsername", u.full_name as "creatorFullName",
        COALESCE(m.member_count, 0) as "memberCount",
        CASE WHEN um.id IS NOT NULL THEN 1 ELSE 0 END as "isMember"
      FROM study_groups sg
      JOIN users u ON sg.creator_id = u.id
      LEFT JOIN (
        SELECT group_id, COUNT(*) as member_count
        FROM study_group_members
        GROUP BY group_id
      ) m ON sg.id = m.group_id
      LEFT JOIN study_group_members um ON sg.id = um.group_id AND um.user_id = ${req.userId || 0}
      WHERE sg.university_id = ${req.universityId}
      ORDER BY sg.created_at DESC
    `;

    return {
      studyGroups: groups.map(group => ({
        id: group.id,
        name: group.name,
        course: group.course || undefined,
        description: group.description || undefined,
        maxMembers: group.maxMembers,
        memberCount: group.memberCount,
        createdAt: group.createdAt,
        creator: {
          id: group.creatorId,
          username: group.creatorUsername,
          fullName: group.creatorFullName,
        },
        isMember: group.isMember === 1,
      })),
    };
  }
);
