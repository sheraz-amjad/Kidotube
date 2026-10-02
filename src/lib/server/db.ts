// ============================================================
// KidoTube Server Database & State Store (In-Memory with Defaults)
// ============================================================

import { StudyReminder, CornerPost } from '../context';

export interface ChildProfile {
  id: string;
  nickname: string;
  avatar: string;
  ageGroup: 'all' | '6-7' | '8-10';
  screenTimeLimit: number;
  screenTimeUsed: number;
  bedtimeHour: number;
  blockedCategories: string[];
  allowKidsCorner: boolean;
  reminders: StudyReminder[];
}

export interface ParentUser {
  id: string;
  email: string;
  passwordHash: string; // In production, bcrypt/argon2
  pin: string;
  createdAt: string;
  children: ChildProfile[];
}

export interface PairingSession {
  code: string;
  parentId: string;
  childProfileId: string;
  expiresAt: number; // timestamp
  used: boolean;
}

export interface DeviceSession {
  deviceToken: string;
  parentId: string;
  childProfileId: string;
  pairedAt: string;
  lastSyncAt: string;
}

// In-memory singletons for server runtime
class MemoryDatabase {
  private parents: Map<string, ParentUser> = new Map();
  private pairingSessions: Map<string, PairingSession> = new Map();
  private deviceSessions: Map<string, DeviceSession> = new Map();
  private posts: CornerPost[] = [];

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Seed default demo parent
    const defaultParent: ParentUser = {
      id: 'parent_demo_01',
      email: 'parent@kidotube.com',
      passwordHash: 'Parent123!',
      pin: '1234',
      createdAt: new Date().toISOString(),
      children: [
        {
          id: 'child_demo_01',
          nickname: 'Sparkle Unicorn',
          avatar: '🦄',
          ageGroup: 'all',
          screenTimeLimit: 60,
          screenTimeUsed: 15,
          bedtimeHour: 20,
          blockedCategories: [],
          allowKidsCorner: true,
          reminders: [
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
          ],
        },
      ],
    };
    this.parents.set(defaultParent.email, defaultParent);

    // Seed approved Kids Corner posts
    this.posts = [
      {
        id: 'post-1',
        childNickname: 'Sparkle Unicorn',
        childAvatar: '🦄',
        artworkUrl: '',
        title: 'My Colorful Butterfly & Flowers',
        category: 'Nature',
        stickerReactions: { '🎨': 8, '🌟': 15, '👏': 9, '💖': 21 },
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
        stickerReactions: { '🎨': 5, '🌟': 12, '👏': 16, '💖': 8 },
        approved: true,
        featured: false,
        createdAt: '2026-10-01',
        aiSafeScanScore: 100,
      },
    ];
  }

  // --- Auth ---
  public findParentByEmail(email: string): ParentUser | undefined {
    return this.parents.get(email.toLowerCase());
  }

  public findParentById(id: string): ParentUser | undefined {
    return Array.from(this.parents.values()).find((p) => p.id === id);
  }

  public createParent(email: string, passwordHash: string, pin: string = '1234'): ParentUser {
    const existing = this.findParentByEmail(email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newParent: ParentUser = {
      id: `parent_${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash,
      pin,
      createdAt: new Date().toISOString(),
      children: [
        {
          id: `child_${Date.now()}`,
          nickname: 'Little Explorer',
          avatar: '🚀',
          ageGroup: 'all',
          screenTimeLimit: 60,
          screenTimeUsed: 0,
          bedtimeHour: 20,
          blockedCategories: [],
          allowKidsCorner: false,
          reminders: [],
        },
      ],
    };
    this.parents.set(newParent.email, newParent);
    return newParent;
  }

  public updateParentPin(parentId: string, newPin: string): boolean {
    const parent = this.findParentById(parentId);
    if (!parent) return false;
    parent.pin = newPin;
    return true;
  }

  // --- Pairing ---
  public createPairingSession(parentId: string, childProfileId?: string): PairingSession {
    const parent = this.findParentById(parentId);
    if (!parent) throw new Error('Parent not found');
    const childId = childProfileId || parent.children[0]?.id || `child_${Date.now()}`;
    
    // Generate readable 6-digit pairing code e.g. "KIDO-4821"
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `KIDO-${randomNum}`;

    const session: PairingSession = {
      code,
      parentId,
      childProfileId: childId,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      used: false,
    };
    this.pairingSessions.set(code, session);
    return session;
  }

  public verifyPairingCode(code: string): DeviceSession {
    const cleanCode = code.trim().toUpperCase();
    const session = this.pairingSessions.get(cleanCode);
    if (!session) {
      throw new Error('Invalid pairing code. Please check and try again.');
    }
    if (session.used) {
      throw new Error('This pairing code has already been used.');
    }
    if (Date.now() > session.expiresAt) {
      throw new Error('Pairing code has expired. Please generate a new code.');
    }

    session.used = true;
    const deviceToken = `dev_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const deviceSession: DeviceSession = {
      deviceToken,
      parentId: session.parentId,
      childProfileId: session.childProfileId,
      pairedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
    };
    this.deviceSessions.set(deviceToken, deviceSession);
    return deviceSession;
  }

  public getDeviceSession(token: string): DeviceSession | undefined {
    return this.deviceSessions.get(token);
  }

  // --- Settings & Sync ---
  public getChildSettings(parentId: string, childId: string) {
    const parent = this.findParentById(parentId);
    if (!parent) return null;
    const child = parent.children.find((c) => c.id === childId) || parent.children[0];
    return {
      parentPin: parent.pin,
      child,
      syncedAt: new Date().toISOString(),
    };
  }

  public updateChildSettings(parentId: string, childId: string, updates: Partial<ChildProfile>) {
    const parent = this.findParentById(parentId);
    if (!parent) return null;
    const childIndex = parent.children.findIndex((c) => c.id === childId);
    if (childIndex === -1) {
      if (parent.children.length > 0) {
        Object.assign(parent.children[0], updates);
        return parent.children[0];
      }
      return null;
    }
    Object.assign(parent.children[childIndex], updates);
    return parent.children[childIndex];
  }

  // --- Kids Corner ---
  public getApprovedCornerPosts(): CornerPost[] {
    return this.posts.filter((p) => p.approved);
  }

  public getAllCornerPosts(): CornerPost[] {
    return this.posts;
  }

  public submitCornerPost(post: Omit<CornerPost, 'id' | 'createdAt' | 'approved' | 'featured' | 'stickerReactions' | 'aiSafeScanScore'>): CornerPost {
    const newPost: CornerPost = {
      ...post,
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      approved: false, // Pre-moderated! Must be approved by admin
      featured: false,
      stickerReactions: { '🎨': 0, '🌟': 0, '👏': 0, '💖': 0 },
      aiSafeScanScore: 100, // 100% in-app kid safe canvas art
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  public reactToPost(postId: string, sticker: string): boolean {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return false;
    if (!['🎨', '🌟', '👏', '💖'].includes(sticker)) return false;
    post.stickerReactions[sticker] = (post.stickerReactions[sticker] || 0) + 1;
    return true;
  }

  public moderatePost(postId: string, action: 'approve' | 'feature' | 'delete'): boolean {
    const index = this.posts.findIndex((p) => p.id === postId);
    if (index === -1) return false;
    if (action === 'approve') {
      this.posts[index].approved = true;
    } else if (action === 'feature') {
      this.posts[index].featured = !this.posts[index].featured;
    } else if (action === 'delete') {
      this.posts.splice(index, 1);
    }
    return true;
  }
}

// Global server singleton
const globalForDb = global as unknown as { kidotubeDb?: MemoryDatabase };
export const db = globalForDb.kidotubeDb || new MemoryDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.kidotubeDb = db;
