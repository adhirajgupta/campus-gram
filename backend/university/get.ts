import { api } from "encore.dev/api";
import { universityDB } from "./db";

export interface University {
  id: number;
  name: string;
  domain: string;
  themeJson: Record<string, any>;
  createdAt: Date;
}

export interface GetUniversityRequest {
  domain: string;
}

// Gets university by domain
export const getByDomain = api<GetUniversityRequest, University>(
  { expose: true, method: "GET", path: "/university/:domain" },
  async (req) => {
    const university = await universityDB.queryRow<University>`
      SELECT id, name, domain, theme_json as "themeJson", created_at as "createdAt"
      FROM universities
      WHERE domain = ${req.domain}
    `;

    if (!university) {
      throw new Error("University not found");
    }

    return university;
  }
);
