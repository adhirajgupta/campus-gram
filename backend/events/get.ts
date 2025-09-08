import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface GetEventRequest {
  eventId: number;
  userId?: number;
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

// Gets a single event by ID
export const get = api<GetEventRequest, Event>(
  { expose: true, method: "GET", path: "/events/:eventId" },
  async (req) => {
    const userId = req.userId || 0;
    
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
      creatorId: number;
      creatorUsername: string;
      creatorFullName: string;
      creatorAvatarUrl: string | null;
      goingCount: number;
      interestedCount: number;
      notGoingCount: number;
      userRsvp: string | null;
    }>`
      SELECT 
        e.id, e.title, e.description, e.location, e.datetime, e.end_datetime as "endDatetime",
        e.category, e.max_attendees as "maxAttendees", e.is_public as "isPublic",
        e.image_url as "imageUrl", e.created_at as "createdAt",
        u.id as "creatorId", u.username as "creatorUsername", 
        u.full_name as "creatorFullName", u.avatar_url as "creatorAvatarUrl",
        COALESCE(rsvp_counts.going_count, 0) as "goingCount",
        COALESCE(rsvp_counts.interested_count, 0) as "interestedCount",
        COALESCE(rsvp_counts.not_going_count, 0) as "notGoingCount",
        user_rsvp.status as "userRsvp"
      FROM events e
      JOIN users u ON e.creator_id = u.id
      LEFT JOIN (
        SELECT 
          event_id,
          SUM(CASE WHEN status = 'going' THEN 1 ELSE 0 END) as going_count,
          SUM(CASE WHEN status = 'interested' THEN 1 ELSE 0 END) as interested_count,
          SUM(CASE WHEN status = 'not_going' THEN 1 ELSE 0 END) as not_going_count
        FROM event_rsvps
        GROUP BY event_id
      ) rsvp_counts ON e.id = rsvp_counts.event_id
      LEFT JOIN event_rsvps user_rsvp ON e.id = user_rsvp.event_id AND user_rsvp.user_id = ${userId}
      WHERE e.id = ${req.eventId}
    `;

    if (!event) {
      throw APIError.notFound("Event not found");
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
        id: event.creatorId,
        username: event.creatorUsername,
        fullName: event.creatorFullName,
        avatarUrl: event.creatorAvatarUrl || undefined,
      },
      rsvpCounts: {
        going: event.goingCount,
        interested: event.interestedCount,
        notGoing: event.notGoingCount,
      },
      userRsvp: event.userRsvp || undefined,
    };
  }
);
