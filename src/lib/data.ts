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
    title: "Tom and Jerry Classic Episode",
    description: "A classic fun episode of Tom and Jerry for kids.",
    youtubeId: "WfPOs1ZDqpM",
    thumbnail: "https://img.youtube.com/vi/WfPOs1ZDqpM/hqdefault.jpg",
    category: "cartoons",
    ageGroup: "all",
    durationMinutes: 7,
    language: "english",
    tags: ["cartoon", "funny", "classic"],
    approved: true,
    addedAt: "2024-01-10",
    views: 1520,
    reports: 0,
  },
  {
    id: "v002",
    title: "Mr. Bean Animated – Library",
    description: "Mr. Bean's animated adventures in the library.",
    youtubeId: "pLm07s8UDa4",
    thumbnail: "https://img.youtube.com/vi/pLm07s8UDa4/hqdefault.jpg",
    category: "cartoons",
    ageGroup: "all",
    durationMinutes: 11,
    language: "english",
    tags: ["cartoon", "mr bean", "animated", "funny"],
    approved: true,
    addedAt: "2024-01-15",
    views: 980,
    reports: 0,
  },
  {
    id: "v003",
    title: "Oggy and the Cockroaches – Snow",
    description: "Oggy has fun in the snow in this funny episode.",
    youtubeId: "6A8lAEiXlj4",
    thumbnail: "https://img.youtube.com/vi/6A8lAEiXlj4/hqdefault.jpg",
    category: "cartoons",
    ageGroup: "all",
    durationMinutes: 9,
    language: "english",
    tags: ["cartoon", "funny", "oggy"],
    approved: true,
    addedAt: "2024-02-01",
    views: 750,
    reports: 0,
  },
  // --- Poems ---
  {
    id: "v004",
    title: "Twinkle Twinkle Little Star",
    description: "The beloved classic nursery rhyme with beautiful animations.",
    youtubeId: "yCjJyiqpAuU",
    thumbnail: "https://img.youtube.com/vi/yCjJyiqpAuU/hqdefault.jpg",
    category: "poems",
    ageGroup: "6-7",
    durationMinutes: 3,
    language: "english",
    tags: ["nursery rhyme", "poem", "classic"],
    approved: true,
    addedAt: "2024-01-05",
    views: 2100,
    reports: 0,
  },
  {
    id: "v005",
    title: "Wheels on the Bus",
    description: "Kids sing along with the Wheels on the Bus nursery rhyme.",
    youtubeId: "e_04ZrNroTo",
    thumbnail: "https://img.youtube.com/vi/e_04ZrNroTo/hqdefault.jpg",
    category: "poems",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "english",
    tags: ["nursery rhyme", "song", "bus"],
    approved: true,
    addedAt: "2024-01-08",
    views: 1830,
    reports: 0,
  },
  {
    id: "v006",
    title: "Old MacDonald Had a Farm",
    description: "A fun farm song with all the animals making their sounds!",
    youtubeId: "5_sfnQDr1-o",
    thumbnail: "https://img.youtube.com/vi/5_sfnQDr1-o/hqdefault.jpg",
    category: "poems",
    ageGroup: "6-7",
    durationMinutes: 3,
    language: "english",
    tags: ["nursery rhyme", "farm", "animals"],
    approved: true,
    addedAt: "2024-01-12",
    views: 1450,
    reports: 0,
  },
  // --- Math ---
  {
    id: "v007",
    title: "Counting 1 to 10 with Objects",
    description: "Fun and visual way to learn counting from 1 to 10.",
    youtubeId: "DR-cfDsHefs",
    thumbnail: "https://img.youtube.com/vi/DR-cfDsHefs/hqdefault.jpg",
    category: "math",
    ageGroup: "6-7",
    durationMinutes: 5,
    language: "english",
    tags: ["counting", "numbers", "math basics"],
    approved: true,
    addedAt: "2024-01-20",
    views: 890,
    reports: 0,
  },
  {
    id: "v008",
    title: "Addition for Kids – Easy Math",
    description: "Learn basic addition with fun colorful animations.",
    youtubeId: "0A8i5zKCGHo",
    thumbnail: "https://img.youtube.com/vi/0A8i5zKCGHo/hqdefault.jpg",
    category: "math",
    ageGroup: "8-10",
    durationMinutes: 6,
    language: "english",
    tags: ["addition", "math", "kids"],
    approved: true,
    addedAt: "2024-02-05",
    views: 670,
    reports: 0,
  },
  {
    id: "v009",
    title: "Shapes for Kids – Circle, Square, Triangle",
    description: "Learn all the basic shapes with fun examples.",
    youtubeId: "0A8i5zKCGHo",
    thumbnail: "https://img.youtube.com/vi/0A8i5zKCGHo/hqdefault.jpg",
    category: "math",
    ageGroup: "6-7",
    durationMinutes: 5,
    language: "english",
    tags: ["shapes", "geometry", "kids"],
    approved: true,
    addedAt: "2024-02-10",
    views: 540,
    reports: 0,
  },
  // --- Science ---
  {
    id: "v010",
    title: "The Water Cycle for Kids",
    description: "Understand how rain happens with a simple fun explanation.",
    youtubeId: "al-do-HGuIk",
    thumbnail: "https://img.youtube.com/vi/al-do-HGuIk/hqdefault.jpg",
    category: "science",
    ageGroup: "8-10",
    durationMinutes: 4,
    language: "english",
    tags: ["science", "water cycle", "weather"],
    approved: true,
    addedAt: "2024-01-25",
    views: 760,
    reports: 0,
  },
  {
    id: "v011",
    title: "Animals and Their Homes",
    description: "Where do different animals live? Find out in this fun video!",
    youtubeId: "al-do-HGuIk",
    thumbnail: "https://img.youtube.com/vi/al-do-HGuIk/hqdefault.jpg",
    category: "science",
    ageGroup: "6-7",
    durationMinutes: 5,
    language: "english",
    tags: ["animals", "habitats", "science"],
    approved: true,
    addedAt: "2024-02-08",
    views: 610,
    reports: 0,
  },
  // --- English ---
  {
    id: "v012",
    title: "ABC Alphabet Song",
    description: "Learn the English alphabet with this catchy song.",
    youtubeId: "75p-N9YKqNo",
    thumbnail: "https://img.youtube.com/vi/75p-N9YKqNo/hqdefault.jpg",
    category: "english",
    ageGroup: "6-7",
    durationMinutes: 3,
    language: "english",
    tags: ["alphabet", "ABC", "letters"],
    approved: true,
    addedAt: "2024-01-03",
    views: 2400,
    reports: 0,
  },
  {
    id: "v013",
    title: "Phonics Song – Letter Sounds",
    description: "Learn the sounds of each letter with fun phonics songs.",
    youtubeId: "BELlZKpi1Zs",
    thumbnail: "https://img.youtube.com/vi/BELlZKpi1Zs/hqdefault.jpg",
    category: "english",
    ageGroup: "6-7",
    durationMinutes: 8,
    language: "english",
    tags: ["phonics", "reading", "alphabet"],
    approved: true,
    addedAt: "2024-01-18",
    views: 1100,
    reports: 0,
  },
  // --- Urdu ---
  {
    id: "v014",
    title: "Alif Bay Pay – Urdu Alphabet Song",
    description: "اردو حروف تہجی کا مزیدار گانا",
    youtubeId: "BELlZKpi1Zs",
    thumbnail: "https://img.youtube.com/vi/BELlZKpi1Zs/hqdefault.jpg",
    category: "urdu",
    ageGroup: "6-7",
    durationMinutes: 4,
    language: "urdu",
    tags: ["urdu", "alphabet", "alif bay pay"],
    approved: true,
    addedAt: "2024-01-22",
    views: 980,
    reports: 0,
  },
  {
    id: "v015",
    title: "Urdu Poem – Titli Rani",
    description: "تتلی رانی - خوبصورت اردو نظم",
    youtubeId: "e_04ZrNroTo",
    thumbnail: "https://img.youtube.com/vi/e_04ZrNroTo/hqdefault.jpg",
    category: "urdu",
    ageGroup: "all",
    durationMinutes: 3,
    language: "urdu",
    tags: ["urdu", "poem", "titli"],
    approved: true,
    addedAt: "2024-02-03",
    views: 1240,
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
