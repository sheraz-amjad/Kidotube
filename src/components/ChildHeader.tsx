'use client';

import Link from 'next/link';
import { useApp, ThemeName } from '@/lib/context';
import { useState, useRef, useEffect } from 'react';
import { sound } from '@/lib/sound';
import styles from './ChildHeader.module.css';

const AVATARS = [
  { emoji: '🦄', label: 'Sparkle' },
  { emoji: '🦁', label: 'Leo' },
  { emoji: '🚀', label: 'Astro' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🦖', label: 'Rex' },
  { emoji: '🐰', label: 'Bunny' },
  { emoji: '🐶', label: 'Puppy' },
];

const THEMES: { id: ThemeName; label: string; icon: string }[] = [
  { id: 'sunshine', label: 'Sunshine Day', icon: '☀️' },
  { id: 'cosmic',   label: 'Cosmic Galaxy', icon: '🌌' },
  { id: 'safari',   label: 'Jungle Safari', icon: '🌿' },
  { id: 'candy',    label: 'Cotton Candy', icon: '🍬' },
  { id: 'ocean',    label: 'Ocean Splash', icon: '🌊' },
];

const ALL_TROPHIES = [
  { id: 'first_star',       emoji: '🌟', name: 'First Star',     desc: 'Watched your first video' },
  { id: 'fav_collector',    emoji: '💖', name: 'Love Collector', desc: 'Saved 3+ favorite videos' },
  { id: 'coloring_picasso', emoji: '🎨', name: 'Picasso Jr.',    desc: 'Created art in Coloring Book' },
  { id: 'math_wizard',      emoji: '🧮', name: 'Math Wizard',    desc: 'Scored 5/5 in Math Quiz' },
  { id: 'spelling_champ',   emoji: '🐝', name: 'Spelling Star',  desc: 'Completed Spelling Bee' },
  { id: 'piano_maestro',    emoji: '🎹', name: 'Little Maestro', desc: 'Played songs on Magic Piano' },
  { id: 'dino_jumper',      emoji: '🦖', name: 'Dino Champion',  desc: 'Jumped obstacles in Dino Runner' },
  { id: 'fruit_catcher',    emoji: '🍓', name: 'Fruit Ninja',    desc: 'Caught 10 fresh fruits' },
  { id: 'puzzle_master',    emoji: '🧩', name: 'Puzzle Solver',  desc: 'Solved the animal puzzle' },
];

export default function ChildHeader() {
  const {
    stars,
    screenTimeUsed,
    screenTimeLimit,
    childAvatar,
    setChildAvatar,
    theme,
    setTheme,
    soundEnabled,
    toggleSound,
    isLullabyPlaying,
    toggleLullaby,
    isBedtimeActive,
    favorites,
    badges,
    streak,
    activeAlertReminder,
    completeStudyReminder,
    snoozeReminder,
    dismissAlertReminder,
  } = useApp();

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const pct = Math.min((screenTimeUsed / screenTimeLimit) * 100, 100);
  const timeLeft = Math.max(screenTimeLimit - screenTimeUsed, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const curThemeIcon = THEMES.find((t) => t.id === theme)?.icon || '🎨';

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* Logo & Avatar */}
          <div className={styles.logoGroup}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon}>🎬</span>
              <span className={styles.logoText}>KidoTube</span>
            </Link>

            {/* Child Avatar Selector */}
            <div ref={avatarRef} style={{ position: 'relative' }}>
              <button
                className={styles.avatarBtn}
                onClick={() => setAvatarOpen(!avatarOpen)}
                title="Change your character!"
                aria-label="Change Avatar"
              >
                <span>{childAvatar}</span>
                <span className={styles.avatarLabel}>Me</span>
              </button>

              {avatarOpen && (
                <div className={styles.popover}>
                  {AVATARS.map((av) => (
                    <button
                      key={av.emoji}
                      className={styles.popoverOption}
                      onClick={() => {
                        setChildAvatar(av.emoji);
                        setAvatarOpen(false);
                      }}
                      title={av.label}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div ref={themeRef} style={{ position: 'relative' }}>
              <button
                className={styles.themeBtn}
                onClick={() => setThemeOpen(!themeOpen)}
                title="Change color theme!"
                aria-label="Change Theme"
              >
                <span>{curThemeIcon}</span>
              </button>

              {themeOpen && (
                <div className={styles.popover}>
                  {THEMES.map((th) => (
                    <button
                      key={th.id}
                      className={styles.popoverOption}
                      onClick={() => {
                        setTheme(th.id);
                        setThemeOpen(false);
                      }}
                      title={th.label}
                    >
                      {th.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Screen time & Bedtime bar */}
          <div className={styles.screenTime}>
            <div className={styles.timeLabel}>
              <span>⏰ {timeLeft}m left</span>
              {isBedtimeActive && <span className={styles.bedtimeAlert}>🌙 Bedtime Soon</span>}
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? '#FF6B6B' : pct > 60 ? '#FFD93D' : '#6BCB77',
                }}
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className={styles.right}>
            {/* Notebook link */}
            <Link href="/notebook" className={styles.notebookLink} title="My Handwriting & Drawing Notebook">
              <span>📓</span>
              <span>Notebook</span>
            </Link>

            {/* Kids Corner link */}
            <Link href="/corner" className={styles.cornerLink} title="Safe Kids Corner Community">
              <span>🎨</span>
              <span>Corner</span>
            </Link>

            {/* Streak Badge */}
            <div className={styles.streakBadge} title={`Daily Study Streak: ${streak} days!`}>
              <span>🔥</span>
              <span>{streak}d</span>
            </div>

            {/* Lullaby audio button */}
            <button
              className={styles.iconBtn}
              onClick={toggleLullaby}
              title={isLullabyPlaying ? 'Playing Bedtime Lullaby' : 'Play Soothing Lullaby 🌙'}
              aria-label="Play Lullaby"
            >
              {isLullabyPlaying ? '🎶' : '🌙'}
            </button>

            {/* Sound Toggle */}
            <button
              className={styles.iconBtn}
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Sounds' : 'Turn On Sounds'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Trophies & Badges Button */}
            <button
              className={styles.badgeNavBtn}
              onClick={() => {
                sound.playStar();
                setShowTrophies(true);
              }}
              title="My Trophies & Badges"
            >
              <span>🏆</span>
              <span>{badges.length}</span>
            </button>

            {/* Favorites link */}
            <Link href="/#favorites" className={styles.navLink} title="My Favorite Videos">
              <span>💖</span>
              <span>{favorites.length}</span>
            </Link>

            {/* Stars */}
            <div className={styles.stars} title={`${stars} Stars earned!`}>
              <span className={styles.starIcon}>⭐</span>
              <span className={styles.starCount}>{stars}</span>
            </div>

            {/* Parents link */}
            <Link href="/parent" className={styles.parentBtn}>
              <span>👨‍👩‍👧</span>
              <span>Parents</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Active Study Alarm / Reminder Alert Banner */}
      {activeAlertReminder && (
        <div className={styles.alarmBanner}>
          <div className={styles.alarmInfo}>
            <span style={{ fontSize: 24, animation: 'float 2s infinite ease-in-out' }}>⏰</span>
            <div>
              <div><strong>Study Alarm:</strong> {activeAlertReminder.title} ({activeAlertReminder.time})</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Earn +{activeAlertReminder.starsReward} Stars & keep your study streak 🔥!</div>
            </div>
          </div>
          <div className={styles.alarmActions}>
            <button
              className={styles.alarmStartBtn}
              onClick={() => {
                sound.playFanfare();
                completeStudyReminder(activeAlertReminder.id);
              }}
            >
              🚀 Start Now (+{activeAlertReminder.starsReward} ⭐)
            </button>
            <button
              className={styles.alarmSnoozeBtn}
              onClick={() => {
                sound.playClick();
                snoozeReminder(activeAlertReminder.id);
              }}
            >
              ⏳ Snooze (5m)
            </button>
            <button
              className={styles.alarmDismissBtn}
              onClick={() => {
                sound.playPop();
                dismissAlertReminder();
              }}
              title="Dismiss for today"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Badges / Trophies Modal */}
      {showTrophies && (
        <div className={styles.modalOverlay} onClick={() => setShowTrophies(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>🏆</span>
            <h2 style={{ fontFamily: 'Fredoka One', fontSize: '26px', marginBottom: '6px' }}>
              My Achievements & Badges
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Complete videos and games to unlock shiny gold trophies!
            </p>

            <div className={styles.trophyGrid}>
              {ALL_TROPHIES.map((tr) => {
                const unlocked = badges.includes(tr.id);
                return (
                  <div
                    key={tr.id}
                    className={`${styles.trophyItem} ${unlocked ? styles.trophyUnlocked : ''}`}
                  >
                    <span className={styles.trophyEmoji}>{tr.emoji}</span>
                    <span className={styles.trophyName}>{tr.name}</span>
                    <span className={styles.trophyDesc}>{unlocked ? 'Unlocked! 🌟' : tr.desc}</span>
                  </div>
                );
              })}
            </div>

            <button className={styles.closeBtn} onClick={() => setShowTrophies(false)}>
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}
    </>
  );
}
