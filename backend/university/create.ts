import { api, APIError } from "encore.dev/api";
import { universityDB } from "./db";
import bcrypt from "bcryptjs";

export interface CreateUniversityRequest {
  name: string;
  domain: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
  themeJson?: Record<string, any>;
}

export interface University {
  id: number;
  name: string;
  domain: string;
  themeJson: Record<string, any>;
  createdAt: Date;
}

// Creates a new university with admin user
export const create = api<CreateUniversityRequest, University>(
  { expose: true, method: "POST", path: "/university" },
  async (req) => {
    // Check if domain already exists
    const existingUniversity = await universityDB.queryRow<{ id: number }>`
      SELECT id FROM universities WHERE domain = ${req.domain}
    `;

    if (existingUniversity) {
      throw APIError.alreadyExists("A university with this domain already exists. Please choose a different domain.");
    }

    // Create university
    const university = await universityDB.queryRow<University>`
      INSERT INTO universities (name, domain, theme_json)
      VALUES (${req.name}, ${req.domain}, ${JSON.stringify(req.themeJson || {})})
      RETURNING id, name, domain, theme_json as "themeJson", created_at as "createdAt"
    `;

    if (!university) {
      throw APIError.internal("Failed to create university");
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(req.adminPassword, 12);
    const username = req.adminEmail.split("@")[0];

    try {
      await universityDB.exec`
        INSERT INTO users (university_id, email, username, full_name, password_hash, is_admin, email_verified_at)
        VALUES (${university.id}, ${req.adminEmail}, ${username}, ${req.adminFullName}, ${passwordHash}, true, NOW())
      `;
    } catch (error: any) {
      // If user creation fails, clean up the university
      await universityDB.exec`DELETE FROM universities WHERE id = ${university.id}`;
      
      if (error.message?.includes('duplicate key value violates unique constraint')) {
        throw APIError.alreadyExists("An admin user with this email already exists. Please use a different email address.");
      }
      
      throw APIError.internal("Failed to create admin user");
    }

    return university;
  }
);
