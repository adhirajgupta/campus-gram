import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface CreateEventRequest {
  universityId: number;
  userId: number;
  title: string;
  description?: string;
  location?: string;
  datetime: Date;
  endDatetime?: Date;
  category?: string;
  maxAttendees?: number;
  isPublic?: boolean;
  imageUrl?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  datetime: Date;
  endDatetime?: Date;
  category: string;
  maxAttendees?: number;
  isPublic: boolean;
  imageUrl?: string;
  createdAt: Date;
  creator: {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  rsvpCounts: {
    going: number;
    interested: number;
    notGoing: number;
  };
  userRsvp?: string;
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
      endDatetime: Date | null;
      category: string;
      maxAttendees: number | null;
      isPublic: boolean;
      imageUrl: string | null;
      createdAt: Date;
    }>`
      INSERT INTO events (
        university_id, title, description, location, datetime, end_datetime,
        category, max_attendees, is_public, image_url, creator_id
      )
      VALUES (
        ${req.universityId}, ${req.title}, ${req.description || null}, 
        ${req.location || null}, ${req.datetime}, ${req.endDatetime || null},
        ${req.category || 'general'}, ${req.maxAttendees || null}, 
        ${req.isPublic ?? true}, ${req.imageUrl || null}, ${req.userId}
      )
      RETURNING id, title, description, location, datetime, end_datetime as "endDatetime",
                category, max_attendees as "maxAttendees", is_public as "isPublic",
                image_url as "imageUrl", created_at as "createdAt"
    `;

    if (!event) {
      throw APIError.internal("Failed to create event");
    }

    // Get creator info
    const creator = await universityDB.queryRow<{
      id: number;
      username: string;
      fullName: string;
      avatarUrl: string | null;
    }>`
      SELECT id, username, full_name as "fullName", avatar_url as "avatarUrl"
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
      endDatetime: event.endDatetime || undefined,
      category: event.category,
      maxAttendees: event.maxAttendees || undefined,
      isPublic: event.isPublic,
      imageUrl: event.imageUrl || undefined,
      createdAt: event.createdAt,
      creator: {
        id: creator.id,
        username: creator.username,
        fullName: creator.fullName,
        avatarUrl: creator.avatarUrl || undefined,
      },
      rsvpCounts: {
        going: 0,
        interested: 0,
        notGoing: 0,
      },
    };
  }
);
