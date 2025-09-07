import { universityDB } from "./db";

// Sample data for seeding
const SAMPLE_NAMES = [
  "Alex Johnson", "Sarah Chen", "Michael Rodriguez", "Emily Davis", "David Kim",
  "Jessica Wang", "Ryan Thompson", "Amanda Garcia", "Chris Lee", "Maya Patel",
  "James Wilson", "Sophie Brown", "Daniel Martinez", "Olivia Taylor", "Noah Anderson",
  "Emma White", "Liam Jackson", "Ava Harris", "William Clark", "Isabella Lewis",
  "Benjamin Walker", "Charlotte Hall", "Lucas Young", "Amelia King", "Henry Wright",
  "Mia Lopez", "Alexander Hill", "Harper Green", "Mason Adams", "Evelyn Baker"
];

const SAMPLE_USERNAMES = [
  "alexj", "sarahc", "mike_r", "emilyd", "davidk", "jessw", "ryant", "amandag",
  "chrisl", "mayap", "jamesw", "sophieb", "danm", "oliviat", "noaha", "emmaw",
  "liamj", "avah", "willc", "isabellal", "benw", "charlotteh", "lucasy", "amelia",
  "henryw", "mial", "alexh", "harperg", "masona", "evelynb"
];

const SAMPLE_MAJORS = [
  "Computer Science", "Business Administration", "Psychology", "Engineering",
  "Biology", "English Literature", "Mathematics", "Economics", "Art History",
  "Political Science", "Chemistry", "Physics", "Sociology", "Philosophy",
  "Communications", "Environmental Science", "Nursing", "Education", "Music",
  "Architecture", "Marketing", "Finance", "International Relations", "Journalism"
];

const SAMPLE_POST_CONTENT = [
  "Just finished my final exam! 🎉 #exams #relief",
  "Beautiful sunset from the library today 📚 #campuslife #sunset",
  "Study group meeting tomorrow at 3pm in the student center! #studygroup #cs101",
  "Anyone know where I can find good coffee on campus? ☕ #coffee #help",
  "Midterm results are in! How did everyone do? #midterms #grades",
  "Campus event tonight at 7pm - don't miss it! #events #fun",
  "Looking for a roommate for next semester! DM me if interested #housing #roommate",
  "Professor Johnson's lecture was amazing today! #learning #inspiration",
  "Free food at the dining hall today! #food #free",
  "Anyone else struggling with this assignment? Let's work together! #help #collaboration",
  "Beautiful day for a walk around campus! #nature #peaceful",
  "Study break with friends at the quad! #friends #break",
  "New club meeting this Friday - all welcome! #clubs #community",
  "Lost my textbook in the library - if found, please return! #lost #textbook",
  "Campus WiFi is acting up again... #technology #frustration",
  "Great turnout at the career fair today! #career #opportunities",
  "Anyone want to grab lunch together? #lunch #friends",
  "Study session in the library until 10pm - join us! #studying #library",
  "Beautiful architecture on the new building! #architecture #campus",
  "Free tutoring available for math courses! #tutoring #help",
  "Campus tour for prospective students tomorrow! #tours #future",
  "Lost and found items at the student center! #lostandfound #items",
  "Weather is perfect for outdoor activities! #weather #outdoor",
  "New study spaces opened in the library! #library #study",
  "Campus security update - stay safe everyone! #safety #security",
  "Free printing available in the computer lab! #printing #free",
  "Student government elections next week! #elections #voting",
  "Campus parking update - new spots available! #parking #transportation",
  "Free yoga classes at the gym! #yoga #fitness #free",
  "Study abroad information session this Thursday! #studyabroad #opportunities"
];

const SAMPLE_EVENT_TITLES = [
  "Study Group: Calculus Review", "Campus Tour for New Students", "Career Fair 2024",
  "Movie Night: The Social Network", "Free Pizza in the Quad", "Guest Speaker: Tech Industry",
  "Study Abroad Information Session", "Student Government Meeting", "Art Exhibition Opening",
  "Science Fair Competition", "Dance Workshop", "Cooking Class: Healthy Meals",
  "Book Club Discussion", "Photography Workshop", "Debate Tournament",
  "Music Concert: Jazz Night", "Fitness Challenge", "Volunteer Fair",
  "Research Symposium", "Cultural Festival", "Study Skills Workshop",
  "Networking Event", "Talent Show", "Environmental Awareness Day",
  "Mental Health Awareness Week", "Sports Tournament", "Food Truck Festival",
  "Graduation Ceremony Rehearsal", "Alumni Reunion", "Freshman Orientation"
];

const SAMPLE_EVENT_DESCRIPTIONS = [
  "Join us for a comprehensive review of calculus concepts before the final exam.",
  "Explore our beautiful campus with guided tours for new and prospective students.",
  "Connect with top employers and discover career opportunities in various fields.",
  "Enjoy a movie night featuring The Social Network with free popcorn!",
  "Free pizza for all students in the main quad - first come, first served!",
  "Learn from industry experts about careers in technology and innovation.",
  "Discover study abroad opportunities and get your questions answered.",
  "Monthly meeting to discuss campus issues and student concerns.",
  "Opening reception for the new student art exhibition.",
  "Showcase your scientific projects and compete for prizes.",
  "Learn basic dance moves in a fun, supportive environment.",
  "Master the art of cooking healthy, budget-friendly meals.",
  "Monthly discussion of selected books with fellow literature enthusiasts.",
  "Improve your photography skills with hands-on workshops.",
  "Watch students debate current issues in this exciting tournament.",
  "Relax with live jazz music performed by student musicians.",
  "Join our fitness challenge and win prizes for participation!",
  "Find volunteer opportunities that match your interests and schedule.",
  "Present your research and learn from fellow students and faculty.",
  "Celebrate diversity with food, music, and cultural performances.",
  "Learn effective study techniques and time management skills.",
  "Build professional connections with alumni and industry professionals.",
  "Showcase your talents in this fun and supportive environment.",
  "Learn about environmental issues and how to make a difference.",
  "Focus on mental health awareness with workshops and resources.",
  "Compete in various sports and win team and individual prizes.",
  "Enjoy delicious food from local vendors in the campus courtyard.",
  "Practice for the upcoming graduation ceremony.",
  "Reconnect with fellow alumni and share memories.",
  "Welcome new students to campus with orientation activities."
];

const SAMPLE_LOCATIONS = [
  "Student Center", "Library", "Main Quad", "Gymnasium", "Auditorium",
  "Computer Lab", "Cafeteria", "Study Room A", "Study Room B", "Conference Room",
  "Art Gallery", "Music Hall", "Science Building", "Business School", "Dormitory Common Room",
  "Outdoor Amphitheater", "Sports Field", "Parking Lot", "Bookstore", "Health Center"
];

const SAMPLE_HASHTAGS = [
  "campuslife", "study", "exams", "friends", "fun", "learning", "college",
  "university", "student", "education", "community", "events", "social",
  "academic", "research", "career", "networking", "volunteer", "sports",
  "music", "art", "culture", "diversity", "wellness", "fitness", "food"
];

// Generate random date within the last 30 days
function getRandomPastDate(): Date {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
}

// Generate random future date within the next 60 days
function getRandomFutureDate(): Date {
  const now = new Date();
  const sixtyDaysFromNow = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
  const randomTime = now.getTime() + Math.random() * (sixtyDaysFromNow.getTime() - now.getTime());
  return new Date(randomTime);
}

// Generate random year (1-4 for undergraduate)
function getRandomYear(): number {
  return Math.floor(Math.random() * 4) + 1;
}

// Generate random image URLs (placeholder images)
function getRandomImageUrls(): string[] {
  const hasImages = Math.random() > 0.6; // 40% chance of having images
  if (!hasImages) return [];
  
  const imageCount = Math.floor(Math.random() * 3) + 1; // 1-3 images
  const images = [];
  for (let i = 0; i < imageCount; i++) {
    images.push(`https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`);
  }
  return images;
}

export async function seedUniversityData(universityId: number, adminUserId: number): Promise<void> {
  try {

    // Create additional users (students)
    const userIds = [adminUserId]; // Start with admin user
    const userCount = 25; // Create 25 additional users

    for (let i = 0; i < userCount; i++) {
      const name = SAMPLE_NAMES[i % SAMPLE_NAMES.length];
      const username = SAMPLE_USERNAMES[i % SAMPLE_USERNAMES.length] + (i > SAMPLE_USERNAMES.length ? i : '');
      const email = `${username}@example.com`;
      const major = SAMPLE_MAJORS[Math.floor(Math.random() * SAMPLE_MAJORS.length)];
      const year = getRandomYear();
      
      // Create user with hashed password
      const passwordHash = await import('bcryptjs').then(bcrypt => bcrypt.hash('password123', 12));
      
      const user = await universityDB.queryRow<{ id: number }>`
        INSERT INTO users (university_id, email, username, full_name, password_hash, year, major, email_verified_at)
        VALUES (${universityId}, ${email}, ${username}, ${name}, ${passwordHash}, ${year}, ${major}, NOW())
        RETURNING id
      `;
      
      if (user) {
        userIds.push(user.id);
      }
    }

    // Create posts (100+ posts)
    const postCount = 120;
    for (let i = 0; i < postCount; i++) {
      const content = SAMPLE_POST_CONTENT[Math.floor(Math.random() * SAMPLE_POST_CONTENT.length)];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const location = Math.random() > 0.7 ? SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)] : null;
      const imageUrls = getRandomImageUrls();
      const hashtags = SAMPLE_HASHTAGS.slice(0, Math.floor(Math.random() * 3) + 1);
      const createdAt = getRandomPastDate();

      await universityDB.exec`
        INSERT INTO posts (university_id, user_id, content, image_urls, location, hashtags, created_at, updated_at)
        VALUES (${universityId}, ${userId}, ${content}, ${JSON.stringify(imageUrls)}, ${location}, ${hashtags}, ${createdAt}, ${createdAt})
      `;
    }

    // Create events (30+ events)
    const eventCount = 35;
    for (let i = 0; i < eventCount; i++) {
      const title = SAMPLE_EVENT_TITLES[Math.floor(Math.random() * SAMPLE_EVENT_TITLES.length)];
      const description = SAMPLE_EVENT_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_EVENT_DESCRIPTIONS.length)];
      const location = SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];
      const creatorId = userIds[Math.floor(Math.random() * userIds.length)];
      const datetime = getRandomFutureDate();

      await universityDB.exec`
        INSERT INTO events (university_id, title, description, location, datetime, creator_id, created_at)
        VALUES (${universityId}, ${title}, ${description}, ${location}, ${datetime}, ${creatorId}, NOW())
      `;
    }

    // Create study groups (15+ groups)
    const studyGroupCount = 18;
    const studyGroupNames = [
      "Advanced Calculus Study Group", "Computer Science Study Group", "Business Strategy Group",
      "Psychology Research Group", "Engineering Design Team", "Biology Lab Partners",
      "English Literature Circle", "Mathematics Problem Solvers", "Economics Discussion Group",
      "Art History Study Group", "Political Science Debate Club", "Chemistry Lab Group",
      "Physics Study Group", "Sociology Research Team", "Philosophy Discussion Group",
      "Communications Study Group", "Environmental Science Group", "Nursing Study Partners"
    ];

    for (let i = 0; i < studyGroupCount; i++) {
      const name = studyGroupNames[i % studyGroupNames.length];
      const course = SAMPLE_MAJORS[Math.floor(Math.random() * SAMPLE_MAJORS.length)] + " 101";
      const description = `Study group for ${course} - all skill levels welcome!`;
      const creatorId = userIds[Math.floor(Math.random() * userIds.length)];
      const maxMembers = Math.floor(Math.random() * 15) + 5; // 5-20 members

      await universityDB.exec`
        INSERT INTO study_groups (university_id, name, course, description, creator_id, max_members, created_at)
        VALUES (${universityId}, ${name}, ${course}, ${description}, ${creatorId}, ${maxMembers}, NOW())
      `;
    }

    // Create campus locations (10+ locations)
    const campusLocationCount = 12;
    const campusLocationNames = [
      "Main Library", "Student Center", "Science Building", "Business School", "Art Gallery",
      "Gymnasium", "Cafeteria", "Computer Lab", "Auditorium", "Study Hall",
      "Outdoor Quad", "Parking Garage"
    ];

    const campusLocationDescriptions = [
      "Main campus library with extensive resources and study spaces",
      "Central hub for student activities and services",
      "State-of-the-art facilities for science education and research",
      "Modern business school with case study rooms",
      "Exhibition space for student and professional art",
      "Fully equipped fitness center and sports facilities",
      "Campus dining with multiple food options",
      "Computer lab with latest technology and software",
      "Large auditorium for lectures and events",
      "Quiet study space for individual and group work",
      "Outdoor gathering space with seating and greenery",
      "Multi-level parking facility for students and staff"
    ];

    for (let i = 0; i < campusLocationCount; i++) {
      const name = campusLocationNames[i % campusLocationNames.length];
      const description = campusLocationDescriptions[i % campusLocationDescriptions.length];
      const category = i < 6 ? 'building' : i < 9 ? 'facility' : 'outdoor';

      await universityDB.exec`
        INSERT INTO campus_locations (university_id, name, description, category, created_at)
        VALUES (${universityId}, ${name}, ${description}, ${category}, NOW())
      `;
    }

    // Add some likes to posts (random likes from users)
    const posts = await universityDB.query<{ id: number }>`
      SELECT id FROM posts WHERE university_id = ${universityId}
    `;

    for (const post of posts) {
      const likeCount = Math.floor(Math.random() * 15) + 1; // 1-15 likes per post
      const shuffledUserIds = [...userIds].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(likeCount, shuffledUserIds.length); i++) {
        try {
          await universityDB.exec`
            INSERT INTO likes (post_id, user_id, created_at)
            VALUES (${post.id}, ${shuffledUserIds[i]}, ${getRandomPastDate()})
            ON CONFLICT (post_id, user_id) DO NOTHING
          `;
        } catch (error) {
          // Ignore duplicate like errors
        }
      }
    }

    // Add some comments to posts
    const commentCount = 80;
    for (let i = 0; i < commentCount; i++) {
      const post = posts[Math.floor(Math.random() * posts.length)];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const commentContent = [
        "Great post! 👍", "I totally agree!", "Thanks for sharing!", "This is helpful!",
        "Same here!", "Interesting perspective", "Good point!", "I'll check this out",
        "Thanks for the info!", "This is awesome!", "I can relate to this", "Well said!",
        "I'm in the same boat", "This made my day!", "So true!", "I needed to hear this",
        "This is exactly what I was looking for", "Thanks for the tip!", "I'll try this",
        "This is inspiring!", "I love this idea!", "Count me in!", "This is perfect!"
      ][Math.floor(Math.random() * 23)];

      await universityDB.exec`
        INSERT INTO comments (post_id, user_id, content, created_at)
        VALUES (${post.id}, ${userId}, ${commentContent}, ${getRandomPastDate()})
      `;
    }

    // Seeding completed successfully
  } catch (error) {
    throw error;
  }
}
