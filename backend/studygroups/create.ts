import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface CreateStudyGroupRequest {
  universityId: number;
  userId: number;
  name: string;
  course?: string;
  description?: string;
  maxMembers?: number;
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

// Creates a new study group
export const create = api<CreateStudyGroupRequest, StudyGroup>(
  { expose: true, method: "POST", path: "/study-groups" },
  async (req) => {
    const group = await universityDB.queryRow<{
      id: number;
      name: string;
      course: string | null;
      description: string | null;
      maxMembers: number;
      createdAt: Date;
    }>`
      INSERT INTO study_groups (university_id, name, course, description, creator_id, max_members)
      VALUES (${req.universityId}, ${req.name}, ${req.course || null}, ${req.description || null}, ${req.userId}, ${req.maxMembers || 10})
      RETURNING id, name, course, description, max_members as "maxMembers", created_at as "createdAt"
    `;

    if (!group) {
      throw APIError.internal("Failed to create study group");
    }

    // Add creator as member
    await universityDB.exec`
      INSERT INTO study_group_members (group_id, user_id)
      VALUES (${group.id}, ${req.userId})
    `;

    // Get creator info
    const creator = await universityDB.queryRow<{
      id: number;
      username: string;
      fullName: string;
    }>`
      SELECT id, username, full_name as "fullName"
      FROM users
      WHERE id = ${req.userId}
    `;

    if (!creator) {
      throw APIError.internal("Creator not found");
    }

    return {
      id: group.id,
      name: group.name,
      course: group.course || undefined,
      description: group.description || undefined,
      maxMembers: group.maxMembers,
      memberCount: 1,
      createdAt: group.createdAt,
      creator: {
        id: creator.id,
        username: creator.username,
        fullName: creator.fullName,
      },
      isMember: true,
    };
  }
);
