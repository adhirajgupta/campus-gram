import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface CreatePostRequest {
  content: string;
  imageUrls?: string[];
  location?: string;
  universityId: number;
  userId: number;
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

// Creates a new post
export const create = api<CreatePostRequest, Post>(
  { expose: true, method: "POST", path: "/posts" },
  async (req) => {
    // Extract hashtags from content
    const hashtags = req.content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];

    const post = await universityDB.queryRow<{
      id: number;
      content: string;
      imageUrls: string[];
      location: string | null;
      hashtags: string[];
      createdAt: Date;
      updatedAt: Date;
    }>`
      INSERT INTO posts (university_id, user_id, content, image_urls, location, hashtags)
      VALUES (${req.universityId}, ${req.userId}, ${req.content}, ${JSON.stringify(req.imageUrls || [])}, ${req.location || null}, ${hashtags})
      RETURNING id, content, image_urls as "imageUrls", location, hashtags, created_at as "createdAt", updated_at as "updatedAt"
    `;

    if (!post) {
      throw APIError.internal("Failed to create post");
    }

    // Get user info
    const user = await universityDB.queryRow<{
      id: number;
      username: string;
      fullName: string;
      avatarUrl: string | null;
      year: number | null;
      major: string | null;
    }>`
      SELECT id, username, full_name as "fullName", avatar_url as "avatarUrl", year, major
      FROM users
      WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.internal("User not found");
    }

    return {
      id: post.id,
      content: post.content,
      imageUrls: post.imageUrls,
      location: post.location || undefined,
      hashtags: post.hashtags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl || undefined,
        year: user.year || undefined,
        major: user.major || undefined,
      },
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
  }
);
