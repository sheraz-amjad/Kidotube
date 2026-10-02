'use client';

import { useApp, AgeGroupFilter } from '@/lib/context';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/data';
import { sound } from '@/lib/sound';
import styles from './page.module.css';

// ============================================================
// PIN Pad Login
// ============================================================
function PINLogin() {
  const { unlockParent, parentPin } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const press = (d: string) => {
    if (pin.length < 4) {
      sound.playPop();
      const newPin = pin + d;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        const ok = unlockParent(newPin);
        if (!ok) {
          setShake(true);
          setError(true);
          setTimeout(() => { setPin(''); setShake(false); }, 800);
        }
      }
    }
  };

  const del = () => {
    sound.playPop();
    setPin((p) => p.slice(0, -1));
  };

  return (
    <div className={styles.pinPage}>
      <div className={`${styles.pinCard} ${shake ? styles.shake : ''}`}>
        <div className={styles.pinLock}>🔐</div>
        <h1 className={styles.pinTitle}>Parent Area</h1>
        <p className={styles.pinSubtitle}>Enter your 4-digit PIN to continue</p>
        <p className={styles.hint}>Current PIN: {parentPin}</p>

        {/* Dots */}
        <div className={styles.pinDots}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${styles.pinDot} ${pin.length > i ? styles.pinDotFilled : ''}`}
            />
          ))}
        </div>

        {error && <p className={styles.pinError}>❌ Wrong PIN. Try again.</p>}

        {/* Number pad */}
        <div className={styles.numPad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, i) => (
            <button
              key={i}
              className={`${styles.numKey} ${key === '' ? styles.numKeyEmpty : ''}`}
              onClick={() => (key === '⌫' ? del() : key !== '' ? press(key) : null)}
              disabled={key === ''}
              aria-label={key === '⌫' ? 'Delete' : key}
            >
              {key}
            </button>
          ))}
        </div>

        <Link href="/" className={styles.backLink}>
          ← Back to KidoTube
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// Parent Dashboard
// ============================================================
function Dashboard() {
  const {
    lockParent,
    parentPin,
    changeParentPin,
    screenTimeLimit,
    screenTimeUsed,
    setScreenTimeLimit,
    giveBonusTime,
    bedtimeHour,
    setBedtimeHour,
    ageFilter,
    setAgeFilter,
    watchHistory,
    clearHistory,
    stars,
    blockedCategories,
    toggleBlockCategory,
    studyReminders,
    addStudyReminder,
    deleteStudyReminder,
    toggleStudyReminder,
    allowKidsCorner,
    toggleAllowKidsCorner,
  } = useApp();

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  // New study reminder state
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemTime, setNewRemTime] = useState('17:00');
  const [newRemReward, setNewRemReward] = useState('5');
  const [newRemCat, setNewRemCat] = useState('poems');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) return;
    addStudyReminder({
      title: newRemTitle.trim(),
      time: newRemTime || '17:00',
      targetCategory: newRemCat,
      starsReward: Number(newRemReward) || 5,
      enabled: true,
    });
    setNewRemTitle('');
    sound.playStar();
  };

  const pct = Math.min((screenTimeUsed / screenTimeLimit) * 100, 100);

  const handleUpdatePin = () => {
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinMsg('❌ New PIN must be exactly 4 digits');
      return;
    }
    const ok = changeParentPin(oldPin, newPin);
    if (ok) {
      setPinMsg('✅ PIN updated successfully!');
      setOldPin('');
      setNewPin('');
    } else {
      setPinMsg('❌ Incorrect current PIN');
    }
  };

  // Compute category watch distribution
  const catMinutes: Record<string, number> = {};
  watchHistory.forEach((item) => {
    catMinutes[item.category] = (catMinutes[item.category] || 0) + item.durationMinutes;
  });
  const totalWatchMins = Object.values(catMinutes).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.dashHeader}>
        <div className={styles.dashHeaderInner}>
          <div>
            <h1 className={styles.dashTitle}>👨‍👩‍👧 Parent Dashboard</h1>
            <p className={styles.dashSub}>
              Monitor screen time, manage bedtime, restrict categories, and track learning
            </p>
          </div>
          <div className={styles.dashHeaderRight}>
            <Link href="/" className={styles.viewSiteBtn}>
              🎬 View Child Portal
            </Link>
            <button className={styles.lockBtn} onClick={lockParent}>
              🔒 Lock Area
            </button>
          </div>
        </div>
      </header>

      <div className={styles.dashContent}>
        {/* Stat Cards */}
        <div className={styles.statGrid}>
          <div className={styles.statCard} style={{ '--accent': '#6C63FF' } as React.CSSProperties}>
            <span className={styles.statIcon}>⏰</span>
            <div>
              <p className={styles.statValue}>{screenTimeUsed}m</p>
              <p className={styles.statLabel}>Screen Time Today</p>
            </div>
          </div>
          <div className={styles.statCard} style={{ '--accent': '#6BCB77' } as React.CSSProperties}>
            <span className={styles.statIcon}>⭐</span>
            <div>
              <p className={styles.statValue}>{stars}</p>
              <p className={styles.statLabel}>Stars Earned</p>
            </div>
          </div>
          <div className={styles.statCard} style={{ '--accent': '#FF6B9D' } as React.CSSProperties}>
            <span className={styles.statIcon}>🎬</span>
            <div>
              <p className={styles.statValue}>{watchHistory.length}</p>
              <p className={styles.statLabel}>Videos Watched</p>
            </div>
          </div>
          <div className={styles.statCard} style={{ '--accent': '#FFD93D' } as React.CSSProperties}>
            <span className={styles.statIcon}>🚫</span>
            <div>
              <p className={styles.statValue}>{blockedCategories.length}</p>
              <p className={styles.statLabel}>Blocked Categories</p>
            </div>
          </div>
        </div>

        <div className={styles.panelGrid}>
          {/* 1. Daily Screen Time */}
          <section className={styles.panel}>
            <div className={styles.panelTitleRow}>
              <h2 className={styles.panelTitle}>⏰ Screen Time Limit</h2>
              <button
                className={styles.bonusBtn}
                onClick={() => giveBonusTime(15)}
                title="Reward child with extra screen time"
              >
                +15 Min Bonus ⭐
              </button>
            </div>
            <div className={styles.timeBar}>
              <div
                className={styles.timeBarFill}
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? '#FF6B6B' : pct > 60 ? '#FFD93D' : '#6BCB77',
                }}
              />
            </div>
            <p className={styles.timeText}>
              {screenTimeUsed} / {screenTimeLimit} minutes used today
            </p>
            <div className={styles.timeOptions}>
              {[30, 45, 60, 90, 120].map((m) => (
                <button
                  key={m}
                  className={`${styles.timeOption} ${screenTimeLimit === m ? styles.timeOptionActive : ''}`}
                  onClick={() => setScreenTimeLimit(m)}
                >
                  {m}m
                </button>
              ))}
            </div>
          </section>

          {/* 2. Bedtime Mode Schedule */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>🌙 Bedtime Sleep Lock</h2>
            <p className={styles.timeText}>
              Automatically locks the portal during nighttime with a soothing bedtime lullaby.
            </p>
            <div className={styles.scheduleRow}>
              {[
                { hour: 0, label: 'Off ☀️' },
                { hour: 19, label: '7:00 PM 🌙' },
                { hour: 20, label: '8:00 PM 🌙' },
                { hour: 21, label: '9:00 PM 🌙' },
                { hour: 22, label: '10:00 PM 🌙' },
              ].map((opt) => (
                <button
                  key={opt.hour}
                  className={`${styles.scheduleBtn} ${bedtimeHour === opt.hour ? styles.scheduleActive : ''}`}
                  onClick={() => setBedtimeHour(opt.hour)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Age Group Filter */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>👶 Age-Appropriate Content</h2>
            <p className={styles.timeText}>
              Tailors recommended videos and puzzles to your child&apos;s developmental age.
            </p>
            <div className={styles.scheduleRow}>
              {[
                { id: 'all', label: 'All Ages (6–10)' },
                { id: '6-7', label: 'Early Learners (6–7)' },
                { id: '8-10', label: 'Older Kids (8–10)' },
              ].map((a) => (
                <button
                  key={a.id}
                  className={`${styles.scheduleBtn} ${ageFilter === a.id ? styles.scheduleActive : ''}`}
                  onClick={() => setAgeFilter(a.id as AgeGroupFilter)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </section>

          {/* 4. Smart Reminders & Study Alarms */}
          <section className={`${styles.panel} ${styles.panelFull}`}>
            <div className={styles.panelTitleRow}>
              <h2 className={styles.panelTitle}>⏰ Smart Study Alarms & Daily Reminders</h2>
              <span style={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>
                Protected by Parent PIN 🔐
              </span>
            </div>
            <p className={styles.timeText}>
              Set scheduled study alarms (e.g. &ldquo;Poem practice at 5:00 PM&rdquo;). Children receive friendly
              alerts with a <strong>Start</strong> button and limited <strong>Snooze (5m)</strong>. Reminders respect screen time
              and quiet bedtime hours, and completing them earns bonus stars toward their streak!
            </p>

            {/* List of active reminders */}
            <div className={styles.reminderList}>
              {studyReminders.map((rem) => (
                <div key={rem.id} className={styles.reminderItem}>
                  <div className={styles.reminderInfo}>
                    <span className={styles.reminderTime}>{rem.time}</span>
                    <div>
                      <div className={styles.reminderTitle}>{rem.title}</div>
                      <div className={styles.reminderMeta}>
                        Category: <strong>{rem.targetCategory}</strong> • Reward: <strong>+{rem.starsReward} ⭐</strong>
                      </div>
                    </div>
                  </div>
                  <div className={styles.reminderActions}>
                    <button
                      className={`${styles.reminderToggleBtn} ${rem.enabled ? styles.reminderToggleActive : styles.reminderToggleInactive}`}
                      onClick={() => toggleStudyReminder(rem.id)}
                      title={rem.enabled ? 'Click to disable' : 'Click to enable'}
                    >
                      {rem.enabled ? '🟢 Active' : '⚪ Paused'}
                    </button>
                    <button
                      className={styles.deleteRemBtn}
                      onClick={() => deleteStudyReminder(rem.id)}
                      title="Delete reminder"
                      aria-label="Delete reminder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Reminder Form */}
            <form onSubmit={handleAddReminder} className={styles.newRemBox}>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>
                ➕ Add a New Study Schedule Alarm
              </div>
              <div className={styles.remInputRow}>
                <input
                  type="text"
                  placeholder="Task title (e.g., 🎵 Poem Practice)"
                  value={newRemTitle}
                  onChange={(e) => setNewRemTitle(e.target.value)}
                  className={styles.remInput}
                  required
                />
                <input
                  type="time"
                  value={newRemTime}
                  onChange={(e) => setNewRemTime(e.target.value)}
                  className={styles.remInput}
                  style={{ maxWidth: 120 }}
                  required
                />
                <select
                  value={newRemCat}
                  onChange={(e) => setNewRemCat(e.target.value)}
                  className={styles.remInput}
                  style={{ maxWidth: 140 }}
                >
                  <option value="poems">Poems</option>
                  <option value="math">Math</option>
                  <option value="english">English</option>
                  <option value="urdu">Urdu</option>
                  <option value="science">Science</option>
                  <option value="drawing">Drawing</option>
                </select>
                <select
                  value={newRemReward}
                  onChange={(e) => setNewRemReward(e.target.value)}
                  className={styles.remInput}
                  style={{ maxWidth: 110 }}
                >
                  <option value="3">+3 Stars</option>
                  <option value="5">+5 Stars</option>
                  <option value="10">+10 Stars</option>
                </select>
                <button type="submit" className={styles.addRemBtn}>
                  Add Alarm
                </button>
              </div>
            </form>
          </section>

          {/* 5. Safe Kids Corner Parent Opt-In */}
          <section className={`${styles.panel} ${styles.panelFull}`}>
            <h2 className={styles.panelTitle}>🛡️ Safe Kids Corner Community Control</h2>
            <p className={styles.timeText}>
              KidoTube uses an ultra-safe, strictly moderated creative wall. Posts are <strong>never</strong> photo uploads (only in-app notebook artwork and drawings). Avatars & nicknames only, preset sticker cheers only, no direct messaging, and every post is screened by AI & admin before appearing.
            </p>
            <div className={styles.optInBox}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#831843', marginBottom: 4 }}>
                  Allow Child to Share Notebook Creations to Kids Corner
                </div>
                <div style={{ fontSize: 13, color: '#9D174D' }}>
                  {allowKidsCorner
                    ? '✅ Permission Granted: Your child can submit notebook drawings to the moderation queue.'
                    : '🔒 Private Mode: Your child can only save drawings in their private local keepsake gallery.'}
                </div>
              </div>
              <button
                className={styles.optInBtn}
                style={{
                  background: allowKidsCorner ? '#10B981' : '#E11D48',
                  color: 'white',
                }}
                onClick={toggleAllowKidsCorner}
              >
                {allowKidsCorner ? 'Enabled 🟢 (Tap to Disable)' : 'Disabled 🔴 (Tap to Enable)'}
              </button>
            </div>
          </section>

          {/* 4. Change Parent PIN */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>🔑 Change Parent PIN</h2>
            <div className={styles.pinChangeBox}>
              <input
                type="password"
                maxLength={4}
                placeholder="Current PIN"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                className={styles.pinInput}
              />
              <input
                type="password"
                maxLength={4}
                placeholder="New 4-digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className={styles.pinInput}
              />
              <button className={styles.savePinBtn} onClick={handleUpdatePin}>
                Update PIN
              </button>
            </div>
            {pinMsg && <p style={{ fontSize: '12px', marginTop: '8px', fontWeight: 700 }}>{pinMsg}</p>}
          </section>

          {/* 5. Category Blocking */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>🚫 Category Filters</h2>
            <p className={styles.timeText}>
              Tap to block/unblock entire categories from your child&apos;s feed:
            </p>
            <div className={styles.catGrid}>
              {CATEGORIES.map((cat) => {
                const blocked = blockedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    className={`${styles.catToggle} ${blocked ? styles.catBlocked : ''}`}
                    onClick={() => toggleBlockCategory(cat.id)}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={styles.catStatus}>
                      {blocked ? '🔴 Blocked' : '🟢 Allowed'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 6. Learning & Watch Analytics */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>📊 Learning Breakdown</h2>
            <p className={styles.timeText}>Time spent learning across topics today:</p>
            {CATEGORIES.map((cat) => {
              const mins = catMinutes[cat.id] || 0;
              const p = Math.round((mins / totalWatchMins) * 100);
              return (
                <div key={cat.id} className={styles.catProgItem}>
                  <div className={styles.catProgHeader}>
                    <span>
                      {cat.emoji} {cat.label}
                    </span>
                    <span>{mins} mins ({p}%)</span>
                  </div>
                  <div className={styles.catProgBar}>
                    <div
                      className={styles.catProgFill}
                      style={{ width: `${p}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </section>

          {/* 7. Watch History */}
          <section className={`${styles.panel} ${styles.panelFull}`}>
            <div className={styles.panelTitleRow}>
              <h2 className={styles.panelTitle}>📋 Watch History Activity Log</h2>
              {watchHistory.length > 0 && (
                <button className={styles.clearBtn} onClick={clearHistory}>
                  Clear History
                </button>
              )}
            </div>
            {watchHistory.length === 0 ? (
              <div className={styles.emptyHistory}>
                <span>📭</span>
                <p>No videos watched yet today.</p>
              </div>
            ) : (
              <div className={styles.historyList}>
                {watchHistory.slice(0, 15).map((h, i) => (
                  <div key={i} className={styles.historyItem}>
                    <div className={styles.historyIcon}>🎬</div>
                    <div className={styles.historyInfo}>
                      <p className={styles.historyTitle}>{h.title}</p>
                      <p className={styles.historyMeta}>
                        {h.category} • {h.durationMinutes} min •{' '}
                        {new Date(h.watchedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ParentPage() {
  const { isParentUnlocked } = useApp();
  return isParentUnlocked ? <Dashboard /> : <PINLogin />;
}
