import { api } from "encore.dev/api";
import { universityDB } from "../university/db";
import bcrypt from "bcryptjs";

export interface SeedResponse {
  message: string;
  universities: number;
  users: number;
  posts: number;
  events: number;
  studyGroups: number;
}

// Seeds the database with sample data
export const seedData = api<void, SeedResponse>(
  { expose: true, method: "POST", path: "/seed" },
  async () => {
    // Clear existing data
    await universityDB.exec`TRUNCATE TABLE notifications, study_group_members, study_groups, events, likes, comments, posts, users, campus_locations, universities RESTART IDENTITY CASCADE`;

    // Create universities
    const university1 = await universityDB.queryRow<{ id: number }>`
      INSERT INTO universities (name, domain, theme_json)
      VALUES ('Stanford University', 'stanford.edu', '{"primaryColor": "#8C1515", "secondaryColor": "#DAA900"}')
      RETURNING id
    `;

    const university2 = await universityDB.queryRow<{ id: number }>`
      INSERT INTO universities (name, domain, theme_json)
      VALUES ('UC Berkeley', 'berkeley.edu', '{"primaryColor": "#003262", "secondaryColor": "#FDB515"}')
      RETURNING id
    `;

    if (!university1 || !university2) {
      throw new Error("Failed to create universities");
    }

    // Create campus locations
    const stanfordLocations = [
      "Main Quad", "Green Library", "Tresidder Union", "Gates Building", 
      "Y2E2", "Packard Building", "Memorial Church", "Cantor Arts Center"
    ];

    const berkeleyLocations = [
      "Campanile", "Doe Library", "Soda Hall", "Wheeler Hall",
      "Sproul Plaza", "MLK Student Union", "Valley Life Sciences Building", "Evans Hall"
    ];

    for (const location of stanfordLocations) {
      await universityDB.exec`
        INSERT INTO campus_locations (university_id, name, category)
        VALUES (${university1.id}, ${location}, 'building')
      `;
    }

    for (const location of berkeleyLocations) {
      await universityDB.exec`
        INSERT INTO campus_locations (university_id, name, category)
        VALUES (${university2.id}, ${location}, 'building')
      `;
    }

    // Create users
    const passwordHash = await bcrypt.hash("password123", 12);
    const users: Array<{ id: number; universityId: number }> = [];

    // Admin users
    const admin1 = await universityDB.queryRow<{ id: number }>`
      INSERT INTO users (university_id, email, username, full_name, password_hash, is_admin, email_verified_at, year, major)
      VALUES (${university1.id}, 'admin@stanford.edu', 'admin', 'Admin User', ${passwordHash}, true, NOW(), 4, 'Computer Science')
      RETURNING id
    `;

    const admin2 = await universityDB.queryRow<{ id: number }>`
      INSERT INTO users (university_id, email, username, full_name, password_hash, is_admin, email_verified_at, year, major)
      VALUES (${university2.id}, 'admin@berkeley.edu', 'admin', 'Admin User', ${passwordHash}, true, NOW(), 4, 'Computer Science')
      RETURNING id
    `;

    if (admin1) users.push({ id: admin1.id, universityId: university1.id });
    if (admin2) users.push({ id: admin2.id, universityId: university2.id });

    // Regular users
    const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Wilson"];
    const majors = ["Computer Science", "Biology", "Psychology", "Economics", "History", "Mathematics", "Physics", "Chemistry", "English", "Art"];

    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const username = `${firstName.toLowerCase()}${i}`;
      const email = `${username}@stanford.edu`;
      const year = Math.floor(Math.random() * 4) + 1;
      const major = majors[Math.floor(Math.random() * majors.length)];

      const user = await universityDB.queryRow<{ id: number }>`
        INSERT INTO users (university_id, email, username, full_name, password_hash, email_verified_at, year, major)
        VALUES (${university1.id}, ${email}, ${username}, ${fullName}, ${passwordHash}, NOW(), ${year}, ${major})
        RETURNING id
      `;

      if (user) users.push({ id: user.id, universityId: university1.id });
    }

    for (let i = 0; i < 25; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
      const fullName = `${firstName} ${lastName}`;
      const username = `${firstName.toLowerCase()}${i}`;
      const email = `${username}@berkeley.edu`;
      const year = Math.floor(Math.random() * 4) + 1;
      const major = majors[Math.floor(Math.random() * majors.length)];

      const user = await universityDB.queryRow<{ id: number }>`
        INSERT INTO users (university_id, email, username, full_name, password_hash, email_verified_at, year, major)
        VALUES (${university2.id}, ${email}, ${username}, ${fullName}, ${passwordHash}, NOW(), ${year}, ${major})
        RETURNING id
      `;

      if (user) users.push({ id: user.id, universityId: university2.id });
    }

    // Create posts
    const samplePosts = [
      "Just finished my midterm! #studyhard #college",
      "Beautiful day on campus 🌞 #campuslife",
      "Anyone want to study for CS106A together? #studygroup #programming",
      "Great lecture today on machine learning #AI #learning",
      "Coffee at the library ☕ #caffeine #finals",
      "Excited for the weekend! #friday #mood",
      "Working on my senior project #thesis #engineering",
      "Love the fall colors on campus 🍂 #autumn #beautiful",
      "Group study session was productive! #teamwork #success",
      "Can't wait for graduation! #senior #almostdone"
    ];

    let postCount = 0;
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const content = samplePosts[Math.floor(Math.random() * samplePosts.length)];
      const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
      
      const locations = user.universityId === university1.id ? stanfordLocations : berkeleyLocations;
      const location = Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : null;

      await universityDB.exec`
        INSERT INTO posts (university_id, user_id, content, hashtags, location)
        VALUES (${user.universityId}, ${user.id}, ${content}, ${hashtags}, ${location})
      `;
      postCount++;
    }

    // Create study groups
    const studyGroupNames = [
      "CS106A Study Group", "Biology Lab Partners", "Calculus Study Session",
      "Physics Problem Solving", "Chemistry Study Group", "Economics Discussion",
      "History Study Circle", "Art History Group", "Psychology Study Team",
      "Statistics Help Group"
    ];

    let studyGroupCount = 0;
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const name = studyGroupNames[i % studyGroupNames.length];
      const course = name.split(' ')[0];
      const description = `A study group for ${course} students to collaborate and learn together.`;

      const group = await universityDB.queryRow<{ id: number }>`
        INSERT INTO study_groups (university_id, name, course, description, creator_id, max_members)
        VALUES (${user.universityId}, ${name}, ${course}, ${description}, ${user.id}, ${Math.floor(Math.random() * 10) + 5})
        RETURNING id
      `;

      if (group) {
        // Add creator as member
        await universityDB.exec`
          INSERT INTO study_group_members (group_id, user_id)
          VALUES (${group.id}, ${user.id})
        `;

        // Add random members
        const sameUniversityUsers = users.filter(u => u.universityId === user.universityId);
        const memberCount = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < memberCount; j++) {
          const randomUser = sameUniversityUsers[Math.floor(Math.random() * sameUniversityUsers.length)];
          if (randomUser.id !== user.id) {
            await universityDB.exec`
              INSERT INTO study_group_members (group_id, user_id)
              VALUES (${group.id}, ${randomUser.id})
              ON CONFLICT (group_id, user_id) DO NOTHING
            `;
          }
        }
      }
      studyGroupCount++;
    }

    // Create events
    const eventTitles = [
      "Career Fair", "Guest Lecture: AI Ethics", "Campus Movie Night",
      "Study Abroad Info Session", "Research Symposium", "Club Fair",
      "Alumni Networking Event", "Hackathon Weekend", "Art Exhibition Opening",
      "Sports Tournament"
    ];

    let eventCount = 0;
    for (let i = 0; i < 20; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const title = eventTitles[i % eventTitles.length];
      const description = `Join us for ${title.toLowerCase()}! This is a great opportunity for students to connect and learn.`;
      const locations = user.universityId === university1.id ? stanfordLocations : berkeleyLocations;
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Random future date within next 30 days
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));

      await universityDB.exec`
        INSERT INTO events (university_id, title, description, location, datetime, creator_id)
        VALUES (${user.universityId}, ${title}, ${description}, ${location}, ${futureDate}, ${user.id})
      `;
      eventCount++;
    }

    return {
      message: "Database seeded successfully!",
      universities: 2,
      users: users.length,
      posts: postCount,
      events: eventCount,
      studyGroups: studyGroupCount,
    };
  }
);
