import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface CreateCommentRequest {
  postId: number;
  userId: number;
  content: string;
  parentCommentId?: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  parentCommentId?: number;
}

// Creates a new comment
export const create = api<CreateCommentRequest, Comment>(
  { expose: true, method: "POST", path: "/comments" },
  async (req) => {
    const comment = await universityDB.queryRow<{
      id: number;
      content: string;
      createdAt: Date;
      parentCommentId: number | null;
    }>`
      INSERT INTO comments (post_id, user_id, content, parent_comment_id)
      VALUES (${req.postId}, ${req.userId}, ${req.content}, ${req.parentCommentId || null})
      RETURNING id, content, created_at as "createdAt", parent_comment_id as "parentCommentId"
    `;

    if (!comment) {
      throw APIError.internal("Failed to create comment");
    }

    // Get user info
    const user = await universityDB.queryRow<{
      id: number;
      username: string;
      fullName: string;
      avatarUrl: string | null;
    }>`
      SELECT id, username, full_name as "fullName", avatar_url as "avatarUrl"
      FROM users
      WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.internal("User not found");
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl || undefined,
      },
      parentCommentId: comment.parentCommentId || undefined,
    };
  }
);
