import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/server/db';

describe('Server API Endpoints & RBAC Tests', () => {
  describe('Parent Authentication & PIN (TC-FUNC-01)', () => {
    it('finds existing demo parent user', () => {
      const parent = db.findParentByEmail('parent@kidotube.com');
      expect(parent).toBeDefined();
      expect(parent?.email).toBe('parent@kidotube.com');
      expect(parent?.pin).toBe('1234');
      expect(parent?.children.length).toBeGreaterThan(0);
    });

    it('creates new parent account with defaults', () => {
      const testEmail = `newparent_${Date.now()}@example.com`;
      const created = db.createParent(testEmail, 'SecretPass123!', '5678');
      expect(created.email).toBe(testEmail);
      expect(created.pin).toBe('5678');
      expect(created.children[0].screenTimeLimit).toBe(60);
    });

    it('prevents duplicate parent accounts with same email', () => {
      expect(() => db.createParent('parent@kidotube.com', 'Pass123!')).toThrow(
        'already exists'
      );
    });

    it('updates parent PIN securely', () => {
      const parent = db.findParentByEmail('parent@kidotube.com');
      expect(parent).toBeDefined();
      const updated = db.updateParentPin(parent!.id, '4321');
      expect(updated).toBe(true);
      expect(db.findParentById(parent!.id)?.pin).toBe('4321');
      // Reset back to 1234
      db.updateParentPin(parent!.id, '1234');
    });
  });

  describe('Parent-Child Device Sync (TC-SYNC-01)', () => {
    it('retrieves child settings for an authorized parent', () => {
      const parent = db.findParentByEmail('parent@kidotube.com')!;
      const settings = db.getChildSettings(parent.id, parent.children[0].id);
      expect(settings).not.toBeNull();
      expect(settings?.child.nickname).toBe('Sparkle Unicorn');
      expect(settings?.child.screenTimeLimit).toBe(60);
    });

    it('updates child settings and applies immediately', () => {
      const parent = db.findParentByEmail('parent@kidotube.com')!;
      const childId = parent.children[0].id;

      const updated = db.updateChildSettings(parent.id, childId, {
        screenTimeLimit: 45,
        blockedCategories: ['scary'],
      });

      expect(updated?.screenTimeLimit).toBe(45);
      expect(updated?.blockedCategories).toContain('scary');

      // Reset
      db.updateChildSettings(parent.id, childId, { screenTimeLimit: 60, blockedCategories: [] });
    });
  });

  describe('Kids Corner Moderation & Reactions (TC-FUNC-10, TC-SAFE-04)', () => {
    it('submits artwork with approved=false (pre-moderation enforced)', () => {
      const post = db.submitCornerPost({
        childNickname: 'Creative Bear',
        childAvatar: '🐻',
        artworkUrl: '',
        title: 'Drawing of a Sunny Day',
        category: 'Nature',
      });

      expect(post.approved).toBe(false);
      expect(post.aiSafeScanScore).toBe(100);

      // Should NOT appear in approved list
      const approvedList = db.getApprovedCornerPosts();
      const foundInApproved = approvedList.some((p) => p.id === post.id);
      expect(foundInApproved).toBe(false);
    });

    it('moderator approves post and it becomes visible in Kids Corner', () => {
      const post = db.submitCornerPost({
        childNickname: 'Little Artist',
        childAvatar: '🎨',
        artworkUrl: '',
        title: 'Happy Rainbow Painting',
        category: 'Art',
      });

      db.moderatePost(post.id, 'approve');

      const approvedList = db.getApprovedCornerPosts();
      const foundInApproved = approvedList.some((p) => p.id === post.id);
      expect(foundInApproved).toBe(true);
    });

    it('increments kid sticker reactions correctly', () => {
      const approved = db.getApprovedCornerPosts()[0];
      const initialCount = approved.stickerReactions['🌟'] || 0;

      const success = db.reactToPost(approved.id, '🌟');
      expect(success).toBe(true);

      const after = db.getApprovedCornerPosts()[0];
      expect(after.stickerReactions['🌟']).toBe(initialCount + 1);
    });
  });
});
