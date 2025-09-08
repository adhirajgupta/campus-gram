import { api, APIError } from "encore.dev/api";
import { universityDB } from "../university/db";

export interface RsvpRequest {
  eventId: number;
  userId: number;
  status: 'going' | 'interested' | 'not_going';
}

export interface RsvpResponse {
  success: boolean;
  status: string;
  rsvpCounts: {
    going: number;
    interested: number;
    notGoing: number;
  };
}

// RSVP to an event
export const rsvp = api<RsvpRequest, RsvpResponse>(
  { expose: true, method: "POST", path: "/events/:eventId/rsvp" },
  async (req) => {
    // Check if event exists
    const event = await universityDB.queryRow<{ id: number; maxAttendees: number | null }>`
      SELECT id, max_attendees as "maxAttendees"
      FROM events
      WHERE id = ${req.eventId}
    `;

    if (!event) {
      throw APIError.notFound("Event not found");
    }

    // Check if user exists
    const user = await universityDB.queryRow<{ id: number }>`
      SELECT id FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw APIError.notFound("User not found");
    }

    // Check capacity if going
    if (req.status === 'going' && event.maxAttendees) {
      const currentGoing = await universityDB.queryRow<{ count: number }>`
        SELECT COUNT(*) as count
        FROM event_rsvps
        WHERE event_id = ${req.eventId} AND status = 'going'
      `;

      if (currentGoing && currentGoing.count >= event.maxAttendees) {
        throw APIError.invalidArgument("Event is at capacity");
      }
    }

    // Upsert RSVP
    await universityDB.exec`
      INSERT INTO event_rsvps (event_id, user_id, status, updated_at)
      VALUES (${req.eventId}, ${req.userId}, ${req.status}, NOW())
      ON CONFLICT (event_id, user_id)
      DO UPDATE SET 
        status = ${req.status},
        updated_at = NOW()
    `;

    // Get updated counts
    const counts = await universityDB.queryRow<{
      goingCount: number;
      interestedCount: number;
      notGoingCount: number;
    }>`
      SELECT 
        SUM(CASE WHEN status = 'going' THEN 1 ELSE 0 END) as "goingCount",
        SUM(CASE WHEN status = 'interested' THEN 1 ELSE 0 END) as "interestedCount",
        SUM(CASE WHEN status = 'not_going' THEN 1 ELSE 0 END) as "notGoingCount"
      FROM event_rsvps
      WHERE event_id = ${req.eventId}
    `;

    return {
      success: true,
      status: req.status,
      rsvpCounts: {
        going: counts?.goingCount || 0,
        interested: counts?.interestedCount || 0,
        notGoing: counts?.notGoingCount || 0,
      },
    };
  }
);
