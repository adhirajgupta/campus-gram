import { api } from "encore.dev/api";
import { universityDB } from "./db";
import bcrypt from "bcryptjs";

export interface CreateUniversityRequest {
  name: string;
  domain: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
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
    // Create university
    const university = await universityDB.queryRow<University>`
      INSERT INTO universities (name, domain, theme_json)
      VALUES (${req.name}, ${req.domain}, '{}')
      RETURNING id, name, domain, theme_json as "themeJson", created_at as "createdAt"
    `;

    if (!university) {
      throw new Error("Failed to create university");
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(req.adminPassword, 12);
    const username = req.adminEmail.split("@")[0];

    await universityDB.exec`
      INSERT INTO users (university_id, email, username, full_name, password_hash, is_admin, email_verified_at)
      VALUES (${university.id}, ${req.adminEmail}, ${username}, ${req.adminFullName}, ${passwordHash}, true, NOW())
    `;

    return university;
  }
);
