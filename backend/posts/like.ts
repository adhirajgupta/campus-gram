import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface LikePostRequest {
  postId: number;
  userId: number;
}

export interface LikePostResponse {
  liked: boolean;
  likesCount: number;
}

// Toggle like on a post
export const toggleLike = api<LikePostRequest, LikePostResponse>(
  { expose: true, method: "POST", path: "/posts/:postId/like" },
  async (req) => {
    // Check if already liked
    const existingLike = await universityDB.queryRow`
      SELECT id FROM likes WHERE post_id = ${req.postId} AND user_id = ${req.userId}
    `;

    let liked: boolean;

    if (existingLike) {
      // Unlike
      await universityDB.exec`
        DELETE FROM likes WHERE post_id = ${req.postId} AND user_id = ${req.userId}
      `;
      liked = false;
    } else {
      // Like
      await universityDB.exec`
        INSERT INTO likes (post_id, user_id) VALUES (${req.postId}, ${req.userId})
      `;
      liked = true;
    }

    // Get updated likes count
    const likesCount = await universityDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM likes WHERE post_id = ${req.postId}
    `;

    return {
      liked,
      likesCount: likesCount?.count || 0,
    };
  }
);
