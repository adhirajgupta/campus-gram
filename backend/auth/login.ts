import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";
import bcrypt from "bcryptjs";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    username: string;
    fullName: string;
    year?: number;
    major?: string;
    universityId: number;
    isAdmin: boolean;
  };
  token: string;
}

// Login user
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    const user = await universityDB.queryRow<{
      id: number;
      email: string;
      username: string;
      fullName: string;
      year: number | null;
      major: string | null;
      universityId: number;
      passwordHash: string;
      isAdmin: boolean;
      isBanned: boolean;
    }>`
      SELECT 
        id, email, username, full_name as "fullName", year, major, 
        university_id as "universityId", password_hash as "passwordHash",
        is_admin as "isAdmin", is_banned as "isBanned"
      FROM users 
      WHERE email = ${req.email}
    `;

    if (!user || user.isBanned) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    const isValid = await bcrypt.compare(req.password, user.passwordHash);
    if (!isValid) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    // Generate simple token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        year: user.year || undefined,
        major: user.major || undefined,
        universityId: user.universityId,
        isAdmin: user.isAdmin,
      },
      token,
    };
  }
);
