const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Resource = require("./models/Resource")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Sample resources data
const resources = [
  {
    title: "Understanding Anxiety: A Comprehensive Guide",
    description:
      "Learn about the different types of anxiety disorders, their symptoms, and evidence-based treatment options.",
    type: "Article",
    category: "Anxiety",
    url: "https://www.helpguide.org/articles/anxiety/anxiety-disorders-and-anxiety-attacks.htm",
    tags: ["anxiety", "panic", "worry", "stress", "mental health"],
  },
  {
    title: "5-Minute Mindfulness Meditation",
    description: "A quick guided meditation practice to help reduce stress and increase present-moment awareness.",
    type: "Exercise",
    category: "Mindfulness",
    url: "https://www.mindful.org/a-five-minute-breathing-meditation/",
    tags: ["meditation", "mindfulness", "breathing", "relaxation", "stress relief"],
  },
  {
    title: "Cognitive Behavioral Therapy Techniques",
    description: "Practical CBT strategies you can use to challenge negative thought patterns and improve your mood.",
    type: "Guide",
    category: "Depression",
    url: "https://www.verywellmind.com/cognitive-behavioral-therapy-techniques-5120243",
    tags: ["depression", "CBT", "therapy", "negative thoughts", "mental health"],
  },
  {
    title: "Sleep Hygiene: Improving Your Sleep Quality",
    description: "Tips and strategies for developing healthy sleep habits and improving your overall sleep quality.",
    type: "Article",
    category: "Sleep",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    tags: ["sleep", "insomnia", "rest", "health", "habits"],
  },
  {
    title: "Progressive Muscle Relaxation Tutorial",
    description:
      "A step-by-step guide to progressive muscle relaxation, a technique to reduce physical tension and stress.",
    type: "Video",
    category: "Stress",
    url: "https://www.youtube.com/watch?v=1nZEdqcGVzo",
    tags: ["relaxation", "stress", "anxiety", "tension", "exercise"],
  },
  {
    title: "Journaling for Mental Health",
    description: "How keeping a journal can help you manage anxiety, reduce stress, and cope with depression.",
    type: "Guide",
    category: "Self-Care",
    url: "https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=4552&ContentTypeID=1",
    tags: ["journaling", "writing", "self-care", "reflection", "mental health"],
  },
  {
    title: "Breathing Exercises for Anxiety",
    description: "Simple breathing techniques you can practice anywhere to help manage anxiety and panic symptoms.",
    type: "Exercise",
    category: "Anxiety",
    url: "https://www.healthline.com/health/breathing-exercises-for-anxiety",
    tags: ["breathing", "anxiety", "panic", "stress", "techniques"],
  },
  {
    title: "Understanding Depression",
    description: "An overview of depression, including symptoms, causes, and treatment options.",
    type: "Article",
    category: "Depression",
    url: "https://www.nimh.nih.gov/health/topics/depression",
    tags: ["depression", "sadness", "mental health", "treatment", "symptoms"],
  },
  {
    title: "Guided Body Scan Meditation",
    description: "A 10-minute guided meditation to help you connect with your body and release tension.",
    type: "Exercise",
    category: "Mindfulness",
    url: "https://www.mindful.org/a-body-scan-meditation-to-help-you-sleep/",
    tags: ["meditation", "mindfulness", "body scan", "relaxation", "sleep"],
  },
  {
    title: "Building Resilience",
    description: "Strategies to help you build resilience and cope with life's challenges.",
    type: "Guide",
    category: "Self-Care",
    url: "https://www.apa.org/topics/resilience",
    tags: ["resilience", "coping", "stress", "mental health", "self-care"],
  },
  {
    title: "National Suicide Prevention Lifeline",
    description: "24/7 support for people in distress. Call 988.",
    type: "Crisis Support",
    category: "Crisis",
    url: "https://988lifeline.org/",
    tags: ["crisis", "suicide", "emergency", "hotline", "help"],
  },
  {
    title: "Crisis Text Line",
    description: "Text HOME to 741741 for crisis support.",
    type: "Crisis Support",
    category: "Crisis",
    url: "https://www.crisistextline.org/",
    tags: ["crisis", "texting", "emergency", "support", "help"],
  },
  {
    title: "Mindfulness Apps Comparison",
    description: "A review of popular mindfulness and meditation apps to help you find the right one for your needs.",
    type: "Article",
    category: "Mindfulness",
    url: "https://www.mindful.org/free-mindfulness-apps-worthy-of-your-attention/",
    tags: ["apps", "mindfulness", "meditation", "technology", "self-care"],
  },
  {
    title: "Healthy Coping Mechanisms",
    description: "A list of healthy ways to cope with stress, anxiety, and difficult emotions.",
    type: "Guide",
    category: "Self-Care",
    url: "https://www.psychologytoday.com/us/blog/click-here-happiness/201812/self-care-12-ways-take-better-care-yourself",
    tags: ["coping", "self-care", "stress", "anxiety", "mental health"],
  },
  {
    title: "Understanding Panic Attacks",
    description: "What panic attacks are, what causes them, and how to manage them effectively.",
    type: "Article",
    category: "Anxiety",
    url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/panic-attacks/",
    tags: ["panic", "anxiety", "attacks", "symptoms", "management"],
  },
]

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing resources
    await Resource.deleteMany({})
    console.log("Cleared existing resources")

    // Insert new resources
    await Resource.insertMany(resources)
    console.log(`Added ${resources.length} resources to the database`)

    // Disconnect from MongoDB
    mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  } catch (error) {
    console.error("Error seeding database:", error)
    mongoose.disconnect()
  }
}

// Run the seed function
seedDatabase()
