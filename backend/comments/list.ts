import { api } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface ListCommentsRequest {
  postId: number;
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
  replies: Comment[];
}

export interface ListCommentsResponse {
  comments: Comment[];
}

// Lists comments for a post
export const list = api<ListCommentsRequest, ListCommentsResponse>(
  { expose: true, method: "GET", path: "/comments/:postId" },
  async (req) => {
    const comments = await universityDB.queryAll<{
      id: number;
      content: string;
      createdAt: Date;
      parentCommentId: number | null;
      userId: number;
      username: string;
      fullName: string;
      avatarUrl: string | null;
    }>`
      SELECT 
        c.id, c.content, c.created_at as "createdAt", c.parent_comment_id as "parentCommentId",
        u.id as "userId", u.username, u.full_name as "fullName", u.avatar_url as "avatarUrl"
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${req.postId}
      ORDER BY c.created_at ASC
    `;

    // Organize into threaded structure
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create all comments
    for (const row of comments) {
      const comment: Comment = {
        id: row.id,
        content: row.content,
        createdAt: row.createdAt,
        user: {
          id: row.userId,
          username: row.username,
          fullName: row.fullName,
          avatarUrl: row.avatarUrl || undefined,
        },
        parentCommentId: row.parentCommentId || undefined,
        replies: [],
      };
      commentMap.set(row.id, comment);
    }

    // Second pass: organize hierarchy
    for (const comment of commentMap.values()) {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    }

    return { comments: rootComments };
  }
);
