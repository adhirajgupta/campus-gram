import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface CreateEventRequest {
  universityId: number;
  userId: number;
  title: string;
  description?: string;
  location?: string;
  datetime: Date;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  datetime: Date;
  createdAt: Date;
  creator: {
    id: number;
    username: string;
    fullName: string;
  };
}

// Creates a new event
export const create = api<CreateEventRequest, Event>(
  { expose: true, method: "POST", path: "/events" },
  async (req) => {
    const event = await universityDB.queryRow<{
      id: number;
      title: string;
      description: string | null;
      location: string | null;
      datetime: Date;
      createdAt: Date;
    }>`
      INSERT INTO events (university_id, title, description, location, datetime, creator_id)
      VALUES (${req.universityId}, ${req.title}, ${req.description || null}, ${req.location || null}, ${req.datetime}, ${req.userId})
      RETURNING id, title, description, location, datetime, created_at as "createdAt"
    `;

    if (!event) {
      throw APIError.internal("Failed to create event");
    }

    // Get creator info
    const creator = await universityDB.queryRow<{
      id: number;
      username: string;
      fullName: string;
    }>`
      SELECT id, username, full_name as "fullName"
      FROM users
      WHERE id = ${req.userId}
    `;

    if (!creator) {
      throw APIError.internal("Creator not found");
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description || undefined,
      location: event.location || undefined,
      datetime: event.datetime,
      createdAt: event.createdAt,
      creator: {
        id: creator.id,
        username: creator.username,
        fullName: creator.fullName,
      },
    };
  }
);
