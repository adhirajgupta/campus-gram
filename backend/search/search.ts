import { api, Query } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface SearchRequest {
  universityId: number;
  query: Query<string>;
  type?: Query<string>;
}

export interface SearchResult {
  users: Array<{
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
    year?: number;
    major?: string;
  }>;
  posts: Array<{
    id: number;
    content: string;
    createdAt: Date;
    user: {
      username: string;
      fullName: string;
    };
  }>;
  locations: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
}

// Search across users, posts, and locations
export const search = api<SearchRequest, SearchResult>(
  { expose: true, method: "GET", path: "/search" },
  async (req) => {
    const query = req.query;
    const searchType = req.type;

    const result: SearchResult = {
      users: [],
      posts: [],
      locations: [],
    };

    // Search users
    if (!searchType || searchType === "users") {
      const users = await universityDB.queryAll<{
        id: number;
        username: string;
        fullName: string;
        avatarUrl: string | null;
        year: number | null;
        major: string | null;
      }>`
        SELECT id, username, full_name as "fullName", avatar_url as "avatarUrl", year, major
        FROM users
        WHERE university_id = ${req.universityId}
          AND (username ILIKE ${'%' + query + '%'} OR full_name ILIKE ${'%' + query + '%'})
        LIMIT 10
      `;

      result.users = users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl || undefined,
        year: user.year || undefined,
        major: user.major || undefined,
      }));
    }

    // Search posts
    if (!searchType || searchType === "posts") {
      const posts = await universityDB.queryAll<{
        id: number;
        content: string;
        createdAt: Date;
        username: string;
        fullName: string;
      }>`
        SELECT p.id, p.content, p.created_at as "createdAt", u.username, u.full_name as "fullName"
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.university_id = ${req.universityId}
          AND (p.content ILIKE ${'%' + query + '%'} OR ${'#' + query} = ANY(p.hashtags))
        ORDER BY p.created_at DESC
        LIMIT 10
      `;

      result.posts = posts.map(post => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        user: {
          username: post.username,
          fullName: post.fullName,
        },
      }));
    }

    // Search locations
    if (!searchType || searchType === "locations") {
      const locations = await universityDB.queryAll<{
        id: number;
        name: string;
        description: string | null;
      }>`
        SELECT id, name, description
        FROM campus_locations
        WHERE university_id = ${req.universityId}
          AND name ILIKE ${'%' + query + '%'}
        LIMIT 10
      `;

      result.locations = locations.map(location => ({
        id: location.id,
        name: location.name,
        description: location.description || undefined,
      }));
    }

    return result;
  }
);
