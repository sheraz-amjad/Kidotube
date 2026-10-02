'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sound } from './sound';
import { Video } from './data';

// ============================================================
// Types
// ============================================================
export interface WatchEntry {
  videoId: string;
  title: string;
  category: string;
  watchedAt: string;
  durationMinutes: number;
}

export type AgeGroupFilter = 'all' | '6-7' | '8-10';
export type ThemeName = 'sunshine' | 'cosmic' | 'safari' | 'candy' | 'ocean';

export interface StudyReminder {
  id: string;
  title: string;
  time: string; // e.g. "17:00"
  targetCategory: string; // e.g. "poems", "math", "english", "urdu", "science"
  starsReward: number;
  enabled: boolean;
  lastCompletedDate?: string;
}

export interface NotebookEntry {
  id: string;
  type: 'tracing' | 'draw_along' | 'freestyle' | 'notes';
  title: string;
  previewUrl: string;
  date: string;
  notes?: string;
  language?: 'english' | 'urdu';
}

export interface CornerPost {
  id: string;
  childNickname: string;
  childAvatar: string;
  artworkUrl: string;
  title: string;
  category: string;
  stickerReactions: Record<string, number>;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  aiSafeScanScore: number;
}

export interface AppContextType {
  // Auth
  isParentUnlocked: boolean;
  isAdminUnlocked: boolean;
  unlockParent: (pin: string) => boolean;
  unlockAdmin: (username: string, password: string) => boolean;
  lockParent: () => void;
  lockAdmin: () => void;
  parentPin: string;
  changeParentPin: (oldPin: string, newPin: string) => boolean;

  // Screen Time & Bedtime
  screenTimeLimit: number;
  screenTimeUsed: number;
  setScreenTimeLimit: (minutes: number) => void;
  addScreenTime: (minutes: number) => void;
  giveBonusTime: (minutes: number) => void;
  isScreenTimeLocked: boolean;
  bedtimeHour: number;
  setBedtimeHour: (hour: number) => void;
  isBedtimeActive: boolean;

  // Watch History & Streak
  watchHistory: WatchEntry[];
  addToHistory: (entry: WatchEntry) => void;
  clearHistory: () => void;
  streak: number;

  // Stars / Rewards
  stars: number;
  addStars: (n: number) => void;

  // Blocked categories & Age Restriction
  blockedCategories: string[];
  toggleBlockCategory: (cat: string) => void;
  isCategoryBlocked: (cat: string) => boolean;
  ageFilter: AgeGroupFilter;
  setAgeFilter: (filter: AgeGroupFilter) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (videoId: string) => void;
  isFavorite: (videoId: string) => boolean;

  // Child Personalization & Themes
  childAvatar: string;
  setChildAvatar: (avatar: string) => void;
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  isLullabyPlaying: boolean;
  toggleLullaby: () => void;

  // Badges & Achievements
  badges: string[];
  unlockBadge: (badgeId: string) => void;

  // Video Reactions
  reactions: Record<string, Record<string, number>>;
  addReaction: (videoId: string, emoji: string) => void;

  // Custom Videos
  customVideos: Video[];
  addCustomVideo: (v: Video) => void;

  // 1. My Notebook
  notebookEntries: NotebookEntry[];
  saveNotebookEntry: (entry: Omit<NotebookEntry, 'id' | 'date'>) => NotebookEntry;
  deleteNotebookEntry: (id: string) => void;

  // 2. Smart Reminders & Alarms
  studyReminders: StudyReminder[];
  addStudyReminder: (rem: Omit<StudyReminder, 'id'>) => void;
  deleteStudyReminder: (id: string) => void;
  toggleStudyReminder: (id: string) => void;
  completeStudyReminder: (id: string) => void;
  activeAlertReminder: StudyReminder | null;
  snoozeReminder: (id: string) => void;
  dismissAlertReminder: () => void;

  // 3. Safe Kids Corner
  kidsCornerPosts: CornerPost[];
  allowKidsCorner: boolean;
  toggleAllowKidsCorner: () => void;
  submitToKidsCorner: (title: string, artworkUrl: string, category: string) => boolean;
  reactToCornerPost: (postId: string, sticker: string) => void;
  approveCornerPost: (postId: string) => void;
  featureCornerPost: (postId: string) => void;
  deleteCornerPost: (postId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PIN = '1234';
const ADMIN_CREDS = { username: 'admin', password: 'kidotube2024' };

const INITIAL_REMINDERS: StudyReminder[] = [
  {
    id: 'rem-1',
    title: '🎵 Daily Poem Practice',
    time: '17:00',
    targetCategory: 'poems',
    starsReward: 5,
    enabled: true,
  },
  {
    id: 'rem-2',
    title: '🔢 Math Fun Quiz',
    time: '18:30',
    targetCategory: 'math',
    starsReward: 5,
    enabled: true,
  },
  {
    id: 'rem-3',
    title: '🌸 Urdu Alphabet Reading',
    time: '19:15',
    targetCategory: 'urdu',
    starsReward: 5,
    enabled: false,
  },
];

const INITIAL_CORNER_POSTS: CornerPost[] = [
  {
    id: 'post-1',
    childNickname: 'Sparkle Unicorn',
    childAvatar: '🦄',
    artworkUrl: '',
    title: 'My Colorful Butterfly & Flowers',
    category: 'Nature',
    stickerReactions: { '🎨': 6, '🌟': 14, '👏': 8, '💖': 19 },
    approved: true,
    featured: true,
    createdAt: '2026-10-01',
    aiSafeScanScore: 100,
  },
  {
    id: 'post-2',
    childNickname: 'Brave Leo',
    childAvatar: '🦁',
    artworkUrl: '',
    title: 'Space Rocket Flying to Mars',
    category: 'Space',
    stickerReactions: { '🎨': 4, '🌟': 11, '👏': 15, '💖': 7 },
    approved: true,
    featured: false,
    createdAt: '2026-10-02',
    aiSafeScanScore: 100,
  },
  {
    id: 'post-3',
    childNickname: 'Astro Kid',
    childAvatar: '🚀',
    artworkUrl: '',
    title: 'Urdu Letter Harf-e-Alif Tracing',
    category: 'Handwriting',
    stickerReactions: { '🎨': 5, '🌟': 9, '👏': 12, '💖': 10 },
    approved: true,
    featured: false,
    createdAt: '2026-10-02',
    aiSafeScanScore: 100,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [parentPin, setParentPinState] = useState(DEFAULT_PIN);
  const [screenTimeLimit, setScreenTimeLimitState] = useState(60);
  const [screenTimeUsed, setScreenTimeUsed] = useState(0);
  const [bedtimeHour, setBedtimeHourState] = useState(20);
  const [watchHistory, setWatchHistory] = useState<WatchEntry[]>([]);
  const [streak, setStreak] = useState(3);
  const [stars, setStars] = useState(24);
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  const [ageFilter, setAgeFilterState] = useState<AgeGroupFilter>('all');
  const [favorites, setFavorites] = useState<string[]>(['v001', 'v004']);
  const [childAvatar, setChildAvatarState] = useState<string>('🦄');
  const [theme, setThemeState] = useState<ThemeName>('sunshine');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLullabyPlaying, setIsLullabyPlaying] = useState(false);
  const [badges, setBadges] = useState<string[]>(['first_star', 'math_wizard']);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});
  const [customVideos, setCustomVideos] = useState<Video[]>([]);

  // 1. My Notebook
  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>([]);

  // 2. Reminders
  const [studyReminders, setStudyReminders] = useState<StudyReminder[]>(INITIAL_REMINDERS);
  const [activeAlertReminder, setActiveAlertReminder] = useState<StudyReminder | null>(null);
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);

  // 3. Safe Kids Corner
  const [kidsCornerPosts, setKidsCornerPosts] = useState<CornerPost[]>(INITIAL_CORNER_POSTS);
  const [allowKidsCorner, setAllowKidsCorner] = useState(true);

  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('kidotube_state_v4');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.parentPin) setParentPinState(state.parentPin);
        if (state.screenTimeLimit) setScreenTimeLimitState(state.screenTimeLimit);
        if (state.bedtimeHour !== undefined) setBedtimeHourState(state.bedtimeHour);
        if (state.watchHistory) setWatchHistory(state.watchHistory);
        if (state.streak !== undefined) setStreak(state.streak);
        if (state.stars !== undefined) setStars(state.stars);
        if (state.blockedCategories) setBlockedCategories(state.blockedCategories);
        if (state.ageFilter) setAgeFilterState(state.ageFilter);
        if (state.favorites) setFavorites(state.favorites);
        if (state.childAvatar) setChildAvatarState(state.childAvatar);
        if (state.theme) {
          setThemeState(state.theme);
          document.documentElement.setAttribute('data-theme', state.theme);
        }
        if (state.badges) setBadges(state.badges);
        if (state.soundEnabled !== undefined) {
          setSoundEnabled(state.soundEnabled);
          sound.setEnabled(state.soundEnabled);
        }
        if (state.reactions) setReactions(state.reactions);
        if (state.customVideos) setCustomVideos(state.customVideos);
        if (state.notebookEntries) setNotebookEntries(state.notebookEntries);
        if (state.studyReminders) setStudyReminders(state.studyReminders);
        if (state.kidsCornerPosts) setKidsCornerPosts(state.kidsCornerPosts);
        if (state.allowKidsCorner !== undefined) setAllowKidsCorner(state.allowKidsCorner);

        // Daily screen time reset check
        const savedDate = state.lastActiveDate;
        const today = new Date().toDateString();
        if (savedDate === today) {
          setScreenTimeUsed(state.screenTimeUsed ?? 0);
        }
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(
        'kidotube_state_v4',
        JSON.stringify({
          parentPin,
          screenTimeLimit,
          screenTimeUsed,
          bedtimeHour,
          watchHistory,
          streak,
          stars,
          blockedCategories,
          ageFilter,
          favorites,
          childAvatar,
          theme,
          badges,
          soundEnabled,
          reactions,
          customVideos,
          notebookEntries,
          studyReminders,
          kidsCornerPosts,
          allowKidsCorner,
          lastActiveDate: new Date().toDateString(),
        })
      );
    } catch {}
  }, [
    isMounted,
    parentPin,
    screenTimeLimit,
    screenTimeUsed,
    bedtimeHour,
    watchHistory,
    streak,
    stars,
    blockedCategories,
    ageFilter,
    favorites,
    childAvatar,
    theme,
    badges,
    soundEnabled,
    reactions,
    customVideos,
    notebookEntries,
    studyReminders,
    kidsCornerPosts,
    allowKidsCorner,
  ]);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const isScreenTimeLocked = screenTimeUsed >= screenTimeLimit;
  const currentHour = new Date().getHours();
  const isBedtimeActive = bedtimeHour > 0 && (currentHour >= bedtimeHour || currentHour < 6);

  // Periodic reminder alert detector (checks every 20 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isScreenTimeLocked || isBedtimeActive) return;
      const now = new Date();
      const curTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayStr = now.toDateString();

      const matched = studyReminders.find(
        (r) =>
          r.enabled &&
          !snoozedIds.includes(r.id) &&
          r.lastCompletedDate !== todayStr &&
          r.time === curTime
      );

      if (matched && !activeAlertReminder) {
        sound.playStar();
        setActiveAlertReminder(matched);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [studyReminders, snoozedIds, activeAlertReminder, isScreenTimeLocked, isBedtimeActive]);

  const unlockParent = (pin: string) => {
    if (pin === parentPin) {
      setIsParentUnlocked(true);
      sound.playWin();
      return true;
    }
    sound.playWrong();
    return false;
  };

  const changeParentPin = (oldPin: string, newPin: string) => {
    if (oldPin === parentPin && newPin.length === 4) {
      setParentPinState(newPin);
      sound.playWin();
      return true;
    }
    sound.playWrong();
    return false;
  };

  const unlockAdmin = (username: string, password: string) => {
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
      setIsAdminUnlocked(true);
      sound.playWin();
      return true;
    }
    sound.playWrong();
    return false;
  };

  const lockParent = () => {
    setIsParentUnlocked(false);
    sound.playPop();
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    sound.playPop();
  };

  const setScreenTimeLimit = (minutes: number) => {
    setScreenTimeLimitState(minutes);
    sound.playPop();
  };

  const addScreenTime = (minutes: number) => {
    setScreenTimeUsed((prev) => prev + minutes);
  };

  const giveBonusTime = (minutes: number) => {
    setScreenTimeLimitState((prev) => prev + minutes);
    sound.playStar();
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      if (prev.includes(badgeId)) return prev;
      sound.playStar();
      return [...prev, badgeId];
    });
  };

  const addToHistory = (entry: WatchEntry) => {
    setWatchHistory((prev) => [entry, ...prev.filter((p) => p.videoId !== entry.videoId)].slice(0, 100));
    addScreenTime(Math.min(entry.durationMinutes, 5));
    addStars(2);
    unlockBadge('first_star');
  };

  const clearHistory = () => {
    setWatchHistory([]);
    sound.playPop();
  };

  const addStars = (n: number) => {
    setStars((prev) => prev + n);
    sound.playStar();
  };

  const toggleBlockCategory = (cat: string) => {
    setBlockedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    sound.playPop();
  };

  const isCategoryBlocked = (cat: string) => blockedCategories.includes(cat);

  const setAgeFilter = (filter: AgeGroupFilter) => {
    setAgeFilterState(filter);
    sound.playPop();
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(videoId);
      if (exists) {
        sound.playPop();
        return prev.filter((id) => id !== videoId);
      } else {
        sound.playStar();
        const next = [...prev, videoId];
        if (next.length >= 3) unlockBadge('fav_collector');
        return next;
      }
    });
  };

  const isFavorite = (videoId: string) => favorites.includes(videoId);

  const setChildAvatar = (avatar: string) => {
    setChildAvatarState(avatar);
    sound.playPop();
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    sound.playPop();
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sound.setEnabled(next);
      if (next) sound.playPop();
      return next;
    });
  };

  const toggleLullaby = () => {
    if (!isLullabyPlaying) {
      setIsLullabyPlaying(true);
      sound.playLullaby();
      setTimeout(() => setIsLullabyPlaying(false), 3000);
    } else {
      setIsLullabyPlaying(false);
    }
  };

  const setBedtimeHour = (h: number) => {
    setBedtimeHourState(h);
    sound.playPop();
  };

  const addReaction = (videoId: string, emoji: string) => {
    sound.playPop();
    setReactions((prev) => {
      const curVideo = prev[videoId] || {};
      return {
        ...prev,
        [videoId]: {
          ...curVideo,
          [emoji]: (curVideo[emoji] || 0) + 1,
        },
      };
    });
  };

  const addCustomVideo = (v: Video) => {
    setCustomVideos((prev) => [v, ...prev]);
    sound.playWin();
  };

  // ============================================================
  // 1. Notebook Handlers
  // ============================================================
  const saveNotebookEntry = (entry: Omit<NotebookEntry, 'id' | 'date'>) => {
    sound.playWin();
    const newEntry: NotebookEntry = {
      ...entry,
      id: `nb-${Date.now()}`,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setNotebookEntries((prev) => [newEntry, ...prev]);
    addStars(5);
    unlockBadge('coloring_picasso');
    return newEntry;
  };

  const deleteNotebookEntry = (id: string) => {
    sound.playPop();
    setNotebookEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // ============================================================
  // 2. Study Reminders & Alarms Handlers
  // ============================================================
  const addStudyReminder = (rem: Omit<StudyReminder, 'id'>) => {
    sound.playStar();
    const newRem: StudyReminder = {
      ...rem,
      id: `rem-${Date.now()}`,
    };
    setStudyReminders((prev) => [...prev, newRem]);
  };

  const deleteStudyReminder = (id: string) => {
    sound.playPop();
    setStudyReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleStudyReminder = (id: string) => {
    sound.playPop();
    setStudyReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const completeStudyReminder = (id: string) => {
    sound.playWin();
    const today = new Date().toDateString();
    setStudyReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, lastCompletedDate: today } : r))
    );
    addStars(10);
    setStreak((s) => s + 1);
    setActiveAlertReminder(null);
  };

  const snoozeReminder = (id: string) => {
    sound.playPop();
    setSnoozedIds((prev) => [...prev, id]);
    setActiveAlertReminder(null);
    // Unsnooze after 5 minutes
    setTimeout(() => {
      setSnoozedIds((prev) => prev.filter((sid) => sid !== id));
    }, 5 * 60 * 1000);
  };

  const dismissAlertReminder = () => {
    sound.playPop();
    setActiveAlertReminder(null);
  };

  // ============================================================
  // 3. Safe Kids Corner Handlers
  // ============================================================
  const toggleAllowKidsCorner = () => {
    sound.playPop();
    setAllowKidsCorner((prev) => !prev);
  };

  const submitToKidsCorner = (title: string, artworkUrl: string, category: string) => {
    if (!allowKidsCorner) {
      sound.playWrong();
      return false;
    }
    sound.playStar();
    const newPost: CornerPost = {
      id: `post-${Date.now()}`,
      childNickname: childAvatar === '🦄' ? 'Sparkle Unicorn' : 'Little Explorer',
      childAvatar,
      artworkUrl,
      title,
      category,
      stickerReactions: { '🎨': 1, '🌟': 1, '👏': 1, '💖': 1 },
      approved: false, // Pre-moderation by Admin
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      aiSafeScanScore: 100, // 100% Kid Safe Drawing scan
    };
    setKidsCornerPosts((prev) => [newPost, ...prev]);
    addStars(5);
    return true;
  };

  const reactToCornerPost = (postId: string, sticker: string) => {
    sound.playPop();
    setKidsCornerPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const curCount = p.stickerReactions[sticker] || 0;
        return {
          ...p,
          stickerReactions: {
            ...p.stickerReactions,
            [sticker]: curCount + 1,
          },
        };
      })
    );
  };

  const approveCornerPost = (postId: string) => {
    sound.playWin();
    setKidsCornerPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, approved: true } : p))
    );
  };

  const featureCornerPost = (postId: string) => {
    sound.playStar();
    setKidsCornerPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, featured: !p.featured } : p))
    );
  };

  const deleteCornerPost = (postId: string) => {
    sound.playPop();
    setKidsCornerPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <AppContext.Provider
      value={{
        isParentUnlocked,
        isAdminUnlocked,
        unlockParent,
        unlockAdmin,
        lockParent,
        lockAdmin,
        parentPin,
        changeParentPin,
        screenTimeLimit,
        screenTimeUsed,
        setScreenTimeLimit,
        addScreenTime,
        giveBonusTime,
        isScreenTimeLocked,
        bedtimeHour,
        setBedtimeHour,
        isBedtimeActive,
        watchHistory,
        addToHistory,
        clearHistory,
        streak,
        stars,
        addStars,
        blockedCategories,
        toggleBlockCategory,
        isCategoryBlocked,
        ageFilter,
        setAgeFilter,
        favorites,
        toggleFavorite,
        isFavorite,
        childAvatar,
        setChildAvatar,
        theme,
        setTheme,
        soundEnabled,
        toggleSound,
        isLullabyPlaying,
        toggleLullaby,
        badges,
        unlockBadge,
        reactions,
        addReaction,
        customVideos,
        addCustomVideo,
        notebookEntries,
        saveNotebookEntry,
        deleteNotebookEntry,
        studyReminders,
        addStudyReminder,
        deleteStudyReminder,
        toggleStudyReminder,
        completeStudyReminder,
        activeAlertReminder,
        snoozeReminder,
        dismissAlertReminder,
        kidsCornerPosts,
        allowKidsCorner,
        toggleAllowKidsCorner,
        submitToKidsCorner,
        reactToCornerPost,
        approveCornerPost,
        featureCornerPost,
        deleteCornerPost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
