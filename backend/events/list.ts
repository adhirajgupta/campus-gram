import { api } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface ListEventsRequest {
  universityId: number;
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

export interface ListEventsResponse {
  events: Event[];
}

// Lists events for university
export const list = api<ListEventsRequest, ListEventsResponse>(
  { expose: true, method: "GET", path: "/events" },
  async (req) => {
    const events = await universityDB.queryAll<{
      id: number;
      title: string;
      description: string | null;
      location: string | null;
      datetime: Date;
      createdAt: Date;
      creatorId: number;
      creatorUsername: string;
      creatorFullName: string;
    }>`
      SELECT 
        e.id, e.title, e.description, e.location, e.datetime, e.created_at as "createdAt",
        u.id as "creatorId", u.username as "creatorUsername", u.full_name as "creatorFullName"
      FROM events e
      JOIN users u ON e.creator_id = u.id
      WHERE e.university_id = ${req.universityId}
      ORDER BY e.datetime ASC
    `;

    return {
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || undefined,
        location: event.location || undefined,
        datetime: event.datetime,
        createdAt: event.createdAt,
        creator: {
          id: event.creatorId,
          username: event.creatorUsername,
          fullName: event.creatorFullName,
        },
      })),
    };
  }
);
