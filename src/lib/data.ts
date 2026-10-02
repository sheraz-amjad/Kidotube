// ============================================================
// KidoTube — Content Data (Mock DB for MVP)
// ============================================================

export type AgeGroup = "6-7" | "8-10" | "all";
export type ContentCategory = "cartoons" | "poems" | "math" | "science" | "english" | "urdu";

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnail: string;
  category: ContentCategory;
  ageGroup: AgeGroup;
  durationMinutes: number;
  language: "english" | "urdu" | "both";
  tags: string[];
  approved: boolean;
  addedAt: string;
  views: number;
  reports: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: "memory" | "math" | "spelling" | "coloring" | "puzzle" | "music" | "arcade";
  ageGroup: AgeGroup;
  emoji: string;
  color: string;
  bgGradient: string;
}

export interface Category {
  id: ContentCategory;
  label: string;
  emoji: string;
  description: string;
  color: string;
  bgGradient: string;
  iconBg: string;
}

// ============================================================
// Categories
// ============================================================
export const CATEGORIES: Category[] = [
  {
    id: "cartoons",
    label: "Cartoons",
    emoji: "🎬",
    description: "Fun and safe animated stories",
    color: "#FF6B9D",
    bgGradient: "linear-gradient(135deg, #FF6B9D, #FF8FAF)",
    iconBg: "#FFE5EF",
  },
  {
    id: "poems",
    label: "Poems",
    emoji: "🎵",
    description: "Rhymes and songs in English & Urdu",
    color: "#6C63FF",
    bgGradient: "linear-gradient(135deg, #6C63FF, #8B7FFF)",
    iconBg: "#EEF0FF",
  },
  {
    id: "math",
    label: "Math",
    emoji: "🔢",
    description: "Numbers, counting & fun sums",
    color: "#FFD93D",
    bgGradient: "linear-gradient(135deg, #FFD93D, #FFDF5E)",
    iconBg: "#FFF8D6",
  },
  {
    id: "science",
    label: "Science",
    emoji: "🔬",
    description: "Explore the amazing world around us",
    color: "#6BCB77",
    bgGradient: "linear-gradient(135deg, #6BCB77, #87D491)",
    iconBg: "#E3F7E6",
  },
  {
    id: "english",
    label: "English",
    emoji: "📚",
    description: "Letters, words and storytelling",
    color: "#4ECDC4",
    bgGradient: "linear-gradient(135deg, #4ECDC4, #71D9D1)",
    iconBg: "#E0F7F6",
  },
  {
    id: "urdu",
    label: "Urdu",
    emoji: "🌸",
    description: "اردو کہانیاں اور نظمیں",
    color: "#FF9F43",
    bgGradient: "linear-gradient(135deg, #FF9F43, #FFB366)",
    iconBg: "#FFF0DC",
  },
];

// ============================================================
// Videos (Curated YouTube Content)
// ============================================================
export const VIDEOS: Video[] = [
  // --- Cartoons ---
  {
    id: "v001",
    title: "Masha and the Bear – Cooking Fun",
    description: "Masha cooks porridge in this hilarious classic cartoon episode for kids.",
    youtubeId: "KYniUCGPGLs",
    thumbnail: "https://img.youtube.com/vi/KYniUCGPGLs/hqdefault.jpg",
    category: "cartoons",
    ageGroup: "all",
    durationMinutes: 7,
    language: "english",
    tags: ["cartoon", "masha", "funny", "family"],
    approved: true,
    addedAt: "2024-01-10",
    views: 3520,
    reports: 0,
  },
  {
    id: "v002",
    title: "Pocoyo – Fun Crafts & Adventures",
    description: "Pocoyo and friends have fun creating crafts and exploring the colorful world.",
    youtubeId: "qx0ZBibwrOM",
    thumbnail: "https://img.youtube.com/vi/qx0ZBibwrOM/hqdefault.jpg",
    category: "cartoons",
    ageGroup: "all",
    durationMinutes: 9,
    language: "english",
    tags: ["cartoon", "pocoyo", "animated", "funny"],
    approved: true,
    addedAt: "2024-01-15",
    views: 2480,
    reports: 0,
  },
  {
    id: "v003",
    title: "Larva – Slapstick Comedy Adventures",
    description: "Red and Yellow the two goofy larvae find hilarious surprises and food.",
    youtubeId: "12C73mF8lCw",
    thumbnail: "https://img.youtube.com/vi/12C73mF8lCw/hqdefault.jpg",
    category: "cartoons",
    ageGroup: "all",
    durationMinutes: 8,
    language: "english",
    tags: ["cartoon", "funny", "larva", "slapstick"],
    approved: true,
    addedAt: "2024-02-01",
    views: 1950,
    reports: 0,
  },
  // --- Poems ---
  {
    id: "v004",
    title: "Twinkle Twinkle Little Star",
    description: "The beloved classic nursery rhyme with beautiful animations and gentle music.",
    youtubeId: "yCjJyiqpAuU",
    thumbnail: "https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg",
    category: "poems",
    ageGroup: "6-7",
    durationMinutes: 3,
    language: "english",
    tags: ["nursery rhyme", "poem", "classic", "lullaby"],
    approved: true,
    addedAt: "2024-01-05",
    views: 4100,
    reports: 0,
  },
  {
    id: "v005",
    title: "Wheels on the Bus",
    description: "Kids sing along with the Wheels on the Bus nursery rhyme through the town.",
    youtubeId: "e_04ZrNroTo",
    thumbnail: "https://img.youtube.com/vi/e_04ZrNroTo/hqdefault.jpg",
    category: "poems",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "english",
    tags: ["nursery rhyme", "song", "bus", "cocomelon"],
    approved: true,
    addedAt: "2024-01-08",
    views: 3830,
    reports: 0,
  },
  {
    id: "v006",
    title: "Baby Shark Dance",
    description: "Sing and dance along with Baby Shark, Mommy Shark, and Daddy Shark!",
    youtubeId: "XqZsoesa55w",
    thumbnail: "https://img.youtube.com/vi/XqZsoesa55w/hqdefault.jpg",
    category: "poems",
    ageGroup: "6-7",
    durationMinutes: 2,
    language: "english",
    tags: ["nursery rhyme", "baby shark", "dance", "song"],
    approved: true,
    addedAt: "2024-01-12",
    views: 5450,
    reports: 0,
  },
  // --- Math ---
  {
    id: "v007",
    title: "Counting 1 to 100 with Fitness",
    description: "Get active, exercise, and count all the way from 1 to 100 with Jack Hartmann.",
    youtubeId: "0TgLtF3PMOc",
    thumbnail: "https://img.youtube.com/vi/0TgLtF3PMOc/hqdefault.jpg",
    category: "math",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "english",
    tags: ["counting", "numbers", "math basics", "exercise"],
    approved: true,
    addedAt: "2024-01-20",
    views: 2890,
    reports: 0,
  },
  {
    id: "v008",
    title: "Basic Addition for Kids – Easy Math",
    description: "A fun and clear beginner crash course to learning how addition works.",
    youtubeId: "0_932pytnZM",
    thumbnail: "https://img.youtube.com/vi/0_932pytnZM/hqdefault.jpg",
    category: "math",
    ageGroup: "8-10",
    durationMinutes: 6,
    language: "english",
    tags: ["addition", "math", "kids", "learning"],
    approved: true,
    addedAt: "2024-02-05",
    views: 1670,
    reports: 0,
  },
  {
    id: "v009",
    title: "Shapes Song – Circle, Square, Triangle",
    description: "Learn all 2D shapes with catchy rhythms and colorful real-world objects.",
    youtubeId: "WTeqUejf3D0",
    thumbnail: "https://img.youtube.com/vi/WTeqUejf3D0/hqdefault.jpg",
    category: "math",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "english",
    tags: ["shapes", "geometry", "kids", "songs"],
    approved: true,
    addedAt: "2024-02-10",
    views: 1540,
    reports: 0,
  },
  // --- Science ---
  {
    id: "v010",
    title: "The Planet Song – 8 Planets of Solar System",
    description: "Travel through outer space and meet Mercury, Venus, Earth, Mars, and beyond!",
    youtubeId: "mQrlgH97v94",
    thumbnail: "https://img.youtube.com/vi/mQrlgH97v94/hqdefault.jpg",
    category: "science",
    ageGroup: "8-10",
    durationMinutes: 4,
    language: "english",
    tags: ["science", "planets", "space", "solar system"],
    approved: true,
    addedAt: "2024-01-25",
    views: 3760,
    reports: 0,
  },
  {
    id: "v011",
    title: "Underwater Animal Adventures! – Nat Geo Kids",
    description: "Dive deep under the ocean to discover sea turtles, colorful fish, and coral reefs.",
    youtubeId: "7CghDWUJRI0",
    thumbnail: "https://img.youtube.com/vi/7CghDWUJRI0/hqdefault.jpg",
    category: "science",
    ageGroup: "6-7",
    durationMinutes: 5,
    language: "english",
    tags: ["animals", "ocean", "nature", "nat geo"],
    approved: true,
    addedAt: "2024-02-08",
    views: 2610,
    reports: 0,
  },
  {
    id: "v012",
    title: "Jungle Animals & Superpowers – Nat Geo Kids",
    description: "Explore the wild jungle and meet jaguars, monkeys, and rainforest creatures.",
    youtubeId: "Xytw4wAWDMg",
    thumbnail: "https://img.youtube.com/vi/Xytw4wAWDMg/hqdefault.jpg",
    category: "science",
    ageGroup: "8-10",
    durationMinutes: 5,
    language: "english",
    tags: ["animals", "jungle", "science", "wildlife"],
    approved: true,
    addedAt: "2024-02-12",
    views: 2190,
    reports: 0,
  },
  // --- English ---
  {
    id: "v013",
    title: "ABC Alphabet Song",
    description: "Sing the classic English alphabet song with gentle melody and clear letters.",
    youtubeId: "75p-N9YKqNo",
    thumbnail: "https://img.youtube.com/vi/75p-N9YKqNo/hqdefault.jpg",
    category: "english",
    ageGroup: "6-7",
    durationMinutes: 3,
    language: "english",
    tags: ["alphabet", "ABC", "letters", "singing"],
    approved: true,
    addedAt: "2024-01-03",
    views: 4400,
    reports: 0,
  },
  {
    id: "v014",
    title: "Phonics Song 2 – Letter Sounds",
    description: "Learn the phonics sounds of all 26 letters with easy phonetic examples.",
    youtubeId: "BELlZKpi1Zs",
    thumbnail: "https://img.youtube.com/vi/BELlZKpi1Zs/hqdefault.jpg",
    category: "english",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "english",
    tags: ["phonics", "reading", "alphabet", "sounds"],
    approved: true,
    addedAt: "2024-01-18",
    views: 3100,
    reports: 0,
  },
  {
    id: "v015",
    title: "A for Apple – Phonics with Two Words",
    description: "Practice two vocabulary words for every single letter of the alphabet!",
    youtubeId: "hq3yfQnllfQ",
    thumbnail: "https://img.youtube.com/vi/hq3yfQnllfQ/hqdefault.jpg",
    category: "english",
    ageGroup: "6-7",
    durationMinutes: 5,
    language: "english",
    tags: ["phonics", "vocabulary", "english", "words"],
    approved: true,
    addedAt: "2024-01-28",
    views: 2850,
    reports: 0,
  },
  // --- Urdu ---
  {
    id: "v016",
    title: "Alif Bay Pay – Khaled Anam Official",
    description: "خالد انعام کی خوبصورت آواز میں اردو حروف تہجی کا مشہور گانا",
    youtubeId: "96pvdHvuN2c",
    thumbnail: "https://img.youtube.com/vi/96pvdHvuN2c/hqdefault.jpg",
    category: "urdu",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "urdu",
    tags: ["urdu", "alphabet", "alif bay pay", "khaled anam"],
    approved: true,
    addedAt: "2024-01-22",
    views: 2980,
    reports: 0,
  },
  {
    id: "v017",
    title: "Alif Bay Pay Train – Haroof-e-Tahajji",
    description: "چھک چھک گاڑی کے ساتھ اردو حروف تہجی اور الفاظ سیکھئے",
    youtubeId: "qyBfVHhm3j0",
    thumbnail: "https://img.youtube.com/vi/qyBfVHhm3j0/hqdefault.jpg",
    category: "urdu",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "urdu",
    tags: ["urdu", "train", "haroof e tahajji", "kids"],
    approved: true,
    addedAt: "2024-01-30",
    views: 2340,
    reports: 0,
  },
  {
    id: "v018",
    title: "Titli Udi Ud Na Saki – Urdu Nazm",
    description: "تتلی اڑی اڑ نہ سکی، بس میں چڑھی سیٹ نہ ملی - پیاری بچوں کی نظم",
    youtubeId: "9Aw93hmBt9M",
    thumbnail: "https://img.youtube.com/vi/9Aw93hmBt9M/hqdefault.jpg",
    category: "urdu",
    ageGroup: "all",
    durationMinutes: 3,
    language: "urdu",
    tags: ["urdu", "poem", "titli", "rhyme"],
    approved: true,
    addedAt: "2024-02-03",
    views: 3240,
    reports: 0,
  },
];

// ============================================================
// Games
// ============================================================
export const GAMES: Game[] = [
  {
    id: "g001",
    title: "Memory Match",
    description: "Flip cards and find matching pairs! Train your memory.",
    slug: "memory-match",
    category: "memory",
    ageGroup: "all",
    emoji: "🧠",
    color: "#6C63FF",
    bgGradient: "linear-gradient(135deg, #6C63FF, #8B7FFF)",
  },
  {
    id: "g002",
    title: "Math Quiz",
    description: "Answer fun addition and subtraction questions to earn stars!",
    slug: "math-quiz",
    category: "math",
    ageGroup: "all",
    emoji: "🔢",
    color: "#FFD93D",
    bgGradient: "linear-gradient(135deg, #FFD93D, #FFDF5E)",
  },
  {
    id: "g003",
    title: "Spelling Bee",
    description: "Arrange the letters to spell the word and win badges!",
    slug: "spelling-bee",
    category: "spelling",
    ageGroup: "8-10",
    emoji: "🐝",
    color: "#FF9F43",
    bgGradient: "linear-gradient(135deg, #FF9F43, #FFB366)",
  },
  {
    id: "g004",
    title: "Coloring Book",
    description: "Paint beautiful pictures with your favorite colors!",
    slug: "coloring-book",
    category: "coloring",
    ageGroup: "all",
    emoji: "🎨",
    color: "#FF6B9D",
    bgGradient: "linear-gradient(135deg, #FF6B9D, #FF8FAF)",
  },
  {
    id: "g005",
    title: "Animal Puzzle",
    description: "Put the animal puzzle pieces together as fast as you can!",
    slug: "animal-puzzle",
    category: "puzzle",
    ageGroup: "6-7",
    emoji: "🦁",
    color: "#6BCB77",
    bgGradient: "linear-gradient(135deg, #6BCB77, #87D491)",
  },
  {
    id: "g006",
    title: "Balloon Pop",
    description: "Pop the floating balloons before they fly into the clouds!",
    slug: "balloon-pop",
    category: "puzzle",
    ageGroup: "all",
    emoji: "🎈",
    color: "#00CEC9",
    bgGradient: "linear-gradient(135deg, #00CEC9, #81ECEC)",
  },
  {
    id: "g007",
    title: "Magic Piano",
    description: "Play colorful musical keys and learn popular nursery rhymes!",
    slug: "magic-piano",
    category: "music",
    ageGroup: "all",
    emoji: "🎹",
    color: "#A29BFE",
    bgGradient: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
  },
  {
    id: "g008",
    title: "Dino Runner",
    description: "Jump over prehistoric obstacles and score high points!",
    slug: "dino-runner",
    category: "arcade",
    ageGroup: "all",
    emoji: "🦖",
    color: "#00B894",
    bgGradient: "linear-gradient(135deg, #00B894, #55EFC4)",
  },
  {
    id: "g009",
    title: "Fruit Catcher",
    description: "Catch delicious fresh fruits falling into your basket!",
    slug: "fruit-catcher",
    category: "arcade",
    ageGroup: "all",
    emoji: "🍓",
    color: "#FF7675",
    bgGradient: "linear-gradient(135deg, #D63031, #FF7675)",
  },
];

// ============================================================
// Analytics & Query helpers
// ============================================================
export function getAllVideos(customVideos: Video[] = []): Video[] {
  return [...customVideos, ...VIDEOS];
}

export function getVideosByCategory(cat: ContentCategory, customVideos: Video[] = []): Video[] {
  return getAllVideos(customVideos).filter((v) => v.category === cat && v.approved);
}

export function getVideoById(id: string, customVideos: Video[] = []): Video | undefined {
  return getAllVideos(customVideos).find((v) => v.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getFeaturedVideos(customVideos: Video[] = []): Video[] {
  return [...getAllVideos(customVideos)].sort((a, b) => b.views - a.views).slice(0, 6);
}

export function getTotalStats(customVideos: Video[] = []) {
  const all = getAllVideos(customVideos);
  return {
    totalVideos: all.length,
    totalGames: GAMES.length,
    totalViews: all.reduce((sum, v) => sum + v.views, 0),
    totalReports: all.reduce((sum, v) => sum + v.reports, 0),
    pendingReviews: all.filter((v) => !v.approved).length,
  };
}
