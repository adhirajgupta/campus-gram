import { api, Query } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface ListPostsRequest {
  universityId: number;
  userId?: number;
  cursor?: Query<string>;
  limit?: Query<number>;
}

export interface Post {
  id: number;
  content: string;
  imageUrls: string[];
  location?: string;
  hashtags: string[];
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
    year?: number;
    major?: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface ListPostsResponse {
  posts: Post[];
  nextCursor?: string;
}

// Lists posts for university feed
export const list = api<ListPostsRequest, ListPostsResponse>(
  { expose: true, method: "GET", path: "/posts" },
  async (req) => {
    const limit = req.limit || 20;
    const offset = req.cursor ? parseInt(req.cursor) : 0;

    const posts = await universityDB.queryAll<{
      id: number;
      content: string;
      imageUrls: string[];
      location: string | null;
      hashtags: string[];
      createdAt: Date;
      updatedAt: Date;
      userId: number;
      username: string;
      fullName: string;
      avatarUrl: string | null;
      year: number | null;
      major: string | null;
      likesCount: number;
      commentsCount: number;
      isLiked: number;
    }>`
      SELECT 
        p.id, p.content, p.image_urls as "imageUrls", p.location, p.hashtags,
        p.created_at as "createdAt", p.updated_at as "updatedAt",
        u.id as "userId", u.username, u.full_name as "fullName", 
        u.avatar_url as "avatarUrl", u.year, u.major,
        COALESCE(l.likes_count, 0) as "likesCount",
        COALESCE(c.comments_count, 0) as "commentsCount",
        CASE WHEN ul.id IS NOT NULL THEN 1 ELSE 0 END as "isLiked"
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) as likes_count
        FROM likes
        GROUP BY post_id
      ) l ON p.id = l.post_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) as comments_count
        FROM comments
        GROUP BY post_id
      ) c ON p.id = c.post_id
      LEFT JOIN likes ul ON p.id = ul.post_id AND ul.user_id = ${req.userId || 0}
      WHERE p.university_id = ${req.universityId}
      ORDER BY p.created_at DESC
      LIMIT ${limit + 1}
      OFFSET ${offset}
    `;

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;

    return {
      posts: items.map(post => ({
        id: post.id,
        content: post.content,
        imageUrls: post.imageUrls,
        location: post.location || undefined,
        hashtags: post.hashtags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.userId,
          username: post.username,
          fullName: post.fullName,
          avatarUrl: post.avatarUrl || undefined,
          year: post.year || undefined,
          major: post.major || undefined,
        },
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        isLiked: post.isLiked === 1,
      })),
      nextCursor: hasMore ? (offset + limit).toString() : undefined,
    };
  }
);
