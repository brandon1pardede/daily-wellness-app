import { neon } from "@neondatabase/serverless";

// Initialize database and seed with mock data
async function initializeDatabase() {
  const sql = neon(process.env.DATABASE_URL!);

  // Create activities table if not exists
  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      day TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      duration TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      equipment TEXT[] NOT NULL,
      benefits TEXT[],
      best_time_of_day TEXT,
      calories TEXT,
      dietary_info TEXT[],
      meal_prep BOOLEAN,
      prompts TEXT[],
      calories_burn TEXT,
      intervals TEXT[],
      exercises TEXT[],
      focus_areas TEXT[],
      is_seeded BOOLEAN DEFAULT false
    )
  `;

  // Check if seeded data exists
  const seededCount =
    await sql`SELECT COUNT(*) FROM activities WHERE is_seeded = true`;
  if (seededCount[0].count === "0") {
    // Seed with mock data
    const mockData = generateMockData();

    for (const [day, activities] of Object.entries(mockData)) {
      for (const activity of activities) {
        await sql`
          INSERT INTO activities (
            day, title, description, image, category, duration, difficulty, 
            equipment, benefits, best_time_of_day, calories, dietary_info,
            meal_prep, prompts, calories_burn, intervals, exercises, focus_areas,
            is_seeded
          ) VALUES (
            ${day}, ${activity.title}, ${activity.description}, ${activity.image},
            ${activity.category}, ${activity.duration}, ${activity.difficulty},
            ${activity.equipment}, ${activity.benefits}, ${activity.bestTimeOfDay},
            ${activity.calories}, ${activity.dietaryInfo}, ${activity.mealPrep},
            ${activity.prompts}, ${activity.caloriesBurn}, ${activity.intervals},
            ${activity.exercises}, ${activity.focusAreas}, true
          )
        `;
      }
    }
  }
}

// Initialize database on first import
initializeDatabase().catch(console.error);

export async function GET(request: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  const { searchParams } = new URL(request.url);

  const day = searchParams.get("day");
  const category = searchParams.get("category");

  let query = sql`SELECT * FROM activities`;

  if (day && day !== "all") {
    query = sql`SELECT * FROM activities WHERE day = ${day}`;
  }
  if (category && category !== "all") {
    query = sql`SELECT * FROM activities WHERE category = ${category}`;
  }
  if (day && day !== "all" && category && category !== "all") {
    query = sql`SELECT * FROM activities WHERE day = ${day} AND category = ${category}`;
  }

  const activities = await query;

  return new Response(JSON.stringify(activities), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

// Generate mock data
const generateMockData = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const activities = [
    {
      title: "Morning Yoga",
      description:
        "Begin your day with an energizing yoga session designed to awaken your body and mind. This 30-minute routine includes sun salutations, gentle stretches, and balancing poses suitable for all levels. Perfect for improving flexibility and mental clarity.",
      category: "Fitness",
      duration: "30 mins",
      difficulty: "Beginner",
      equipment: ["Yoga mat", "Comfortable clothing"],
      benefits: ["Improved flexibility", "Stress reduction", "Better posture"],
      bestTimeOfDay: "Early morning",
    },
    {
      title: "Meditation Session",
      description:
        "Take a mindful break with this guided meditation session focused on breath awareness and mental clarity. The practice includes body scanning, mindful breathing, and loving-kindness meditation. Ideal for reducing stress and improving focus throughout your day.",
      category: "Wellness",
      duration: "15 mins",
      difficulty: "All levels",
      equipment: ["Cushion or chair", "Quiet space"],
      benefits: [
        "Reduced anxiety",
        "Better concentration",
        "Emotional balance",
      ],
      bestTimeOfDay: "Any time",
    },
    {
      title: "Healthy Breakfast",
      description:
        "Start your day right with nutritious breakfast options packed with protein, healthy fats, and complex carbohydrates. Each recipe is designed to provide sustained energy and can be prepared in under 15 minutes. Includes options for various dietary preferences.",
      category: "Nutrition",
      duration: "15 mins prep",
      difficulty: "Easy",
      equipment: ["Basic kitchen tools", "Blender"],
      calories: "300-400",
      dietaryInfo: ["High protein", "Whole grains", "Healthy fats"],
      mealPrep: true,
    },
    {
      title: "Journaling",
      description:
        "Engage in a therapeutic journaling session with guided prompts focused on self-reflection, gratitude, and personal growth. This practice includes both free writing and structured exercises to help process emotions and set intentions for the day ahead.",
      category: "Mindfulness",
      duration: "20 mins",
      difficulty: "All levels",
      equipment: ["Journal", "Pen"],
      benefits: ["Emotional processing", "Goal clarity", "Stress relief"],
      prompts: ["Today I feel...", "I'm grateful for...", "My intention is..."],
    },
    {
      title: "HIIT Workout",
      description:
        "Challenge yourself with this high-intensity interval training session designed to boost metabolism and build strength. The workout alternates between intense bursts of activity and short rest periods. Includes modifications for different fitness levels and minimal equipment needed.",
      category: "Fitness",
      duration: "25 mins",
      difficulty: "Intermediate",
      equipment: ["Exercise mat", "Light dumbbells (optional)"],
      caloriesBurn: "200-300",
      intervals: ["30 sec work", "15 sec rest"],
      exercises: ["Burpees", "Mountain climbers", "Jump squats"],
    },
    {
      title: "Stretching",
      description:
        "Unwind with this comprehensive stretching routine targeting all major muscle groups. Perfect for improving flexibility, reducing muscle tension, and preventing injury. The session includes dynamic and static stretches, with emphasis on proper form and breathing techniques.",
      category: "Wellness",
      duration: "20 mins",
      difficulty: "All levels",
      equipment: ["Yoga mat", "Foam roller (optional)"],
      benefits: [
        "Improved flexibility",
        "Better recovery",
        "Reduced muscle tension",
      ],
      focusAreas: ["Upper body", "Lower body", "Core"],
    },
  ];

  let id = 1;
  const mockData: Record<
    string,
    {
      id: number;
      title: string;
      description: string;
      image: string;
      category: string;
      duration: string;
      difficulty: string;
      equipment: string[];
      benefits?: string[];
      bestTimeOfDay?: string;
      calories?: string;
      dietaryInfo?: string[];
      mealPrep?: boolean;
      prompts?: string[];
      caloriesBurn?: string;
      intervals?: string[];
      exercises?: string[];
      focusAreas?: string[];
    }[]
  > = {};

  days.forEach((day) => {
    mockData[day] = activities.map((activity) => ({
      id: id++,
      ...activity,
      title: `${activity.title} ${Math.floor(Math.random() * 3) + 1}`,
      image: `https://picsum.photos/seed/${id}/400/300`,
    }));
  });

  return mockData;
};
