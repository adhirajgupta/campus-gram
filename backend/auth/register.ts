import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";
import bcrypt from "bcryptjs";

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  year?: number;
  major?: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    username: string;
    fullName: string;
    year?: number;
    major?: string;
    universityId: number;
  };
  token: string;
}

// Register a new user
export const register = api<RegisterRequest, RegisterResponse>(
  { expose: true, method: "POST", path: "/auth/register" },
  async (req) => {
    const emailDomain = req.email.split("@")[1];
    
    // Find university by domain
    const university = await universityDB.queryRow<{ id: number }>`
      SELECT id FROM universities WHERE domain = ${emailDomain}
    `;

    if (!university) {
      throw APIError.invalidArgument("Email domain not associated with any university");
    }

    // Check if user already exists
    const existingUser = await universityDB.queryRow`
      SELECT id FROM users 
      WHERE university_id = ${university.id} AND email = ${req.email}
    `;

    if (existingUser) {
      throw APIError.alreadyExists("User already exists");
    }

    const passwordHash = await bcrypt.hash(req.password, 12);
    const username = req.email.split("@")[0];

    // Create user
    const user = await universityDB.queryRow<{
      id: number;
      email: string;
      username: string;
      fullName: string;
      year: number | null;
      major: string | null;
      universityId: number;
    }>`
      INSERT INTO users (university_id, email, username, full_name, password_hash, year, major, email_verified_at)
      VALUES (${university.id}, ${req.email}, ${username}, ${req.fullName}, ${passwordHash}, ${req.year || null}, ${req.major || null}, NOW())
      RETURNING id, email, username, full_name as "fullName", year, major, university_id as "universityId"
    `;

    if (!user) {
      throw APIError.internal("Failed to create user");
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
      },
      token,
    };
  }
);
