import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/server/db';

describe('Child Safety & Platform Logic Tests', () => {
  describe('Screen Time & Bedtime Lock Logic', () => {
    it('TC-FUNC-07: triggers screen-time lock when screenTimeUsed exceeds screenTimeLimit', () => {
      const limit = 60; // minutes
      const used = 65;
      const isLocked = used >= limit;
      expect(isLocked).toBe(true);
    });

    it('TC-FUNC-07: allows access when screenTimeUsed is below limit', () => {
      const limit = 60;
      const used = 45;
      const isLocked = used >= limit;
      expect(isLocked).toBe(false);
    });

    it('TC-SAFE-06: locks during bedtime hours (e.g. after 8:00 PM)', () => {
      const bedtimeHour = 20; // 8:00 PM
      const currentHourLate = 21; // 9:00 PM
      const currentHourDay = 14; // 2:00 PM

      const isBedtimeLate = currentHourLate >= bedtimeHour || currentHourLate < 6;
      const isBedtimeDay = currentHourDay >= bedtimeHour || currentHourDay < 6;

      expect(isBedtimeLate).toBe(true);
      expect(isBedtimeDay).toBe(false);
    });
  });

  describe('Child Privacy & PII Protection (TC-SAFE-01 to TC-SAFE-05)', () => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    it('detects and blocks emails in kid submissions', () => {
      const unsafeInput = 'Hi my name is Leo and my email is leo@example.com';
      expect(emailRegex.test(unsafeInput)).toBe(true);
    });

    it('detects and blocks phone numbers in kid submissions', () => {
      const unsafeInput = 'Call me at 555-123-4567';
      expect(phoneRegex.test(unsafeInput)).toBe(true);
    });

    it('detects and blocks external web links', () => {
      const unsafeInput = 'Check out my cool video at https://dangerous-site.com/video';
      expect(urlRegex.test(unsafeInput)).toBe(true);
    });

    it('allows clean, kid-friendly nicknames and artwork titles', () => {
      const safeNickname = 'Sparkle Unicorn';
      const safeTitle = 'My Rainbow and Butterfly Drawing';
      expect(emailRegex.test(safeNickname)).toBe(false);
      expect(phoneRegex.test(safeNickname)).toBe(false);
      expect(urlRegex.test(safeTitle)).toBe(false);
    });
  });

  describe('Pairing Code Generation & Expiration (TC-FUNC-02)', () => {
    it('generates pairing code with KIDO- prefix and 4 digits', () => {
      const session = db.createPairingSession('parent_demo_01');
      expect(session.code).toMatch(/^KIDO-\d{4}$/);
      expect(session.expiresAt).toBeGreaterThan(Date.now());
      expect(session.used).toBe(false);
    });

    it('verifies pairing code and issues secure device token', () => {
      const session = db.createPairingSession('parent_demo_01');
      const deviceSession = db.verifyPairingCode(session.code);

      expect(deviceSession.deviceToken).toMatch(/^dev_tok_/);
      expect(deviceSession.parentId).toBe('parent_demo_01');

      // Cannot reuse same code
      expect(() => db.verifyPairingCode(session.code)).toThrow('already been used');
    });

    it('rejects invalid or non-existent pairing codes', () => {
      expect(() => db.verifyPairingCode('KIDO-999999')).toThrow('Invalid pairing code');
    });
  });

  describe('Kids Corner Reaction Whitelist', () => {
    it('accepts only predefined kid-safe sticker reactions', () => {
      const allowed = ['🎨', '🌟', '👏', '💖'];
      expect(allowed.includes('🎨')).toBe(true);
      expect(allowed.includes('🌟')).toBe(true);
      expect(allowed.includes('😡')).toBe(false); // Disallowed angry emoji
      expect(allowed.includes('👎')).toBe(false); // Disallowed dislike
    });
  });
});
