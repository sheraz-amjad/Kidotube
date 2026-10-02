'use client';

import { useApp } from '@/lib/context';
import ChildHeader from '@/components/ChildHeader';
import CategoryCard from '@/components/CategoryCard';
import VideoCard from '@/components/VideoCard';
import GameCard from '@/components/GameCard';
import { CATEGORIES, GAMES, getAllVideos, getVideosByCategory } from '@/lib/data';
import { sound } from '@/lib/sound';
import styles from './page.module.css';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function Home() {
  const {
    favorites,
    watchHistory,
    blockedCategories,
    childAvatar,
    isScreenTimeLocked,
    isBedtimeActive,
    customVideos,
    ageFilter,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<'all' | 'english' | 'urdu' | 'hindi'>('all');

  // Filter available categories (hide parent-blocked ones)
  const availableCategories = useMemo(() => {
    return CATEGORIES.filter((c) => !blockedCategories.includes(c.id));
  }, [blockedCategories]);

  // Combine curated & custom videos, filtered by age and unblocked categories
  const allVideos = useMemo(() => {
    return getAllVideos(customVideos).filter((v) => {
      // Must not belong to a blocked category
      if (blockedCategories.includes(v.category)) return false;
      // Age group filter
      if (ageFilter !== 'all' && v.ageGroup !== 'all' && v.ageGroup !== ageFilter) return false;
      return true;
    });
  }, [customVideos, blockedCategories, ageFilter]);

  // Filtered search & category results
  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      if (selectedCat !== 'all' && v.category !== selectedCat) return false;
      if (selectedLang !== 'all' && v.language !== selectedLang && v.language !== 'both') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = v.title.toLowerCase().includes(q);
        const matchesDesc = v.description.toLowerCase().includes(q);
        const matchesTags = v.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [allVideos, selectedCat, selectedLang, searchQuery]);

  // Favorite Videos
  const favoriteVideos = useMemo(() => {
    return allVideos.filter((v) => favorites.includes(v.id));
  }, [allVideos, favorites]);

  // Recently watched videos
  const recentlyWatched = useMemo(() => {
    const ids = watchHistory.map((w) => w.videoId);
    return allVideos.filter((v) => ids.includes(v.id)).slice(0, 4);
  }, [allVideos, watchHistory]);

  const games = GAMES.slice(0, 6);

  return (
    <div className={styles.page}>
      <ChildHeader />

      {/* Bedtime Notice if night time */}
      {isBedtimeActive && (
        <div className={styles.bedtimeNotice}>
          <span>🌙</span>
          <span>Bedtime Mode is active. It will soon be time for sleep! Sweet dreams! 🌟</span>
        </div>
      )}

      <main>
        {/* Screen Time Lock Banner if time expired */}
        {isScreenTimeLocked && (
          <div className={styles.container}>
            <div className={styles.screenLockHero}>
              <div className={styles.lockEmoji}>⏰ 🦕</div>
              <h2 className={styles.lockTitle}>Screen Time Limit Reached!</h2>
              <p className={styles.lockDesc}>
                You&apos;ve used all your screen time for today. Time to stretch, play outside, or read a book!
              </p>
              <Link href="/parent" className={styles.heroBtn}>
                👨‍👩‍👧 Parent Settings
              </Link>
            </div>
          </div>
        )}

        {/* Hero Banner */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <div className={styles.badge}>
                <span>🌟 100% Safe for Kids</span>
              </div>
              <h1 className={styles.heroTitle}>
                Learn, Play &<br />
                <span className={styles.heroGradient}>Have Fun!</span>
              </h1>
              <p className={styles.heroDesc}>
                Welcome back, {childAvatar}! Cartoons, rhymes, lessons, and games picked just for you.
              </p>
              <div className={styles.heroBtns}>
                <Link
                  href="/category/cartoons"
                  className={styles.heroBtn}
                  onClick={() => sound.playPop()}
                >
                  🎬 Watch Videos
                </Link>
                <Link
                  href="/games"
                  className={styles.heroBtnOutline}
                  onClick={() => sound.playPop()}
                >
                  🎮 Play Games
                </Link>
              </div>
            </div>
            <div className={styles.heroArt}>
              <div
                className={styles.heroMascot}
                onClick={() => sound.playWin()}
                title="Click me for cheerful fanfare!"
              >
                {childAvatar}
              </div>
              <button
                className={styles.floatBubble1}
                onClick={() => sound.playPop()}
                aria-label="Books"
              >
                📚
              </button>
              <button
                className={styles.floatBubble2}
                onClick={() => sound.playStar()}
                aria-label="Music"
              >
                🎵
              </button>
              <button
                className={styles.floatBubble3}
                onClick={() => sound.playPop()}
                aria-label="Numbers"
              >
                🔢
              </button>
              <button
                className={styles.floatBubble4}
                onClick={() => sound.playStar()}
                aria-label="Star"
              >
                ⭐
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Kid Search & Filter Bar */}
        <section className={styles.searchSection}>
          <div className={styles.container}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search cartoons, poems, rhymes, math, science..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearch}
                  onClick={() => {
                    sound.playPop();
                    setSearchQuery('');
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className={styles.filterPills}>
              <button
                className={`${styles.filterPill} ${selectedCat === 'all' && selectedLang === 'all' ? styles.filterPillActive : ''}`}
                onClick={() => {
                  sound.playPop();
                  setSelectedCat('all');
                  setSelectedLang('all');
                }}
              >
                🌟 All Videos
              </button>

              {availableCategories.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.filterPill} ${selectedCat === c.id ? styles.filterPillActive : ''}`}
                  onClick={() => {
                    sound.playPop();
                    setSelectedCat(selectedCat === c.id ? 'all' : c.id);
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              ))}

              <button
                className={`${styles.filterPill} ${selectedLang === 'urdu' ? styles.filterPillActive : ''}`}
                onClick={() => {
                  sound.playPop();
                  setSelectedLang(selectedLang === 'urdu' ? 'all' : 'urdu');
                }}
              >
                🇵🇰 Urdu
              </button>
              <button
                className={`${styles.filterPill} ${selectedLang === 'hindi' ? styles.filterPillActive : ''}`}
                onClick={() => {
                  sound.playPop();
                  setSelectedLang(selectedLang === 'hindi' ? 'all' : 'hindi');
                }}
              >
                🇮🇳 Hindi
              </button>
              <button
                className={`${styles.filterPill} ${selectedLang === 'english' ? styles.filterPillActive : ''}`}
                onClick={() => {
                  sound.playPop();
                  setSelectedLang(selectedLang === 'english' ? 'all' : 'english');
                }}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </section>

        {/* Search Results (When Active) */}
        {(searchQuery || selectedCat !== 'all' || selectedLang !== 'all') && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  🔎 Filtered Results ({filteredVideos.length})
                </h2>
              </div>
              {filteredVideos.length === 0 ? (
                <div className={styles.noResults}>
                  <span className={styles.noResultsEmoji}>🎈</span>
                  <h3 className={styles.noResultsTitle}>No videos matched your search!</h3>
                  <p className={styles.noResultsDesc}>
                    Try searching for something else like &quot;rhymes&quot;, &quot;science&quot;, or clear filters.
                  </p>
                </div>
              ) : (
                <div className={styles.videosGrid}>
                  {filteredVideos.map((v, i) => (
                    <VideoCard key={v.id} video={v} delay={i * 50} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Favorite Videos Shelf (If Any) */}
        {favoriteVideos.length > 0 && (
          <section id="favorites" className={`${styles.section} ${styles.sectionWarm}`}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>💖 My Favorite Videos</h2>
                <p className={styles.sectionSub}>Videos you clicked the heart on!</p>
              </div>
              <div className={styles.videosGrid}>
                {favoriteVideos.map((v, i) => (
                  <VideoCard key={v.id} video={v} delay={i * 60} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Continue Watching Shelf (If Any) */}
        {recentlyWatched.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🕒 Continue Watching</h2>
                <p className={styles.sectionSub}>Pick up where you left off!</p>
              </div>
              <div className={styles.videosGrid}>
                {recentlyWatched.map((v, i) => (
                  <VideoCard key={v.id} video={v} delay={i * 60} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Grid */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📂 Choose a Category</h2>
              <p className={styles.sectionSub}>What do you feel like learning today?</p>
            </div>
            <div className={styles.categoriesGrid}>
              {availableCategories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  videoCount={getVideosByCategory(cat.id, customVideos).length}
                  delay={i * 70}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured / Popular Videos */}
        <section className={`${styles.section} ${styles.sectionPurple}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🔥 Popular Videos</h2>
              <p className={styles.sectionSub}>Most loved by kids!</p>
            </div>
            <div className={styles.videosGrid}>
              {allVideos.slice(0, 6).map((v, i) => (
                <VideoCard key={v.id} video={v} delay={i * 70} />
              ))}
            </div>
          </div>
        </section>

        {/* Games Row */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🎮 Play & Learn</h2>
              <p className={styles.sectionSub}>Interactive educational games that earn stars!</p>
              <Link href="/games" className={styles.seeAll}>
                See All 9 Games →
              </Link>
            </div>
            <div className={styles.gamesGrid}>
              {GAMES.slice(0, 8).map((g, i) => (
                <GameCard key={g.id} game={g} delay={i * 70} />
              ))}
            </div>
          </div>
        </section>

        {/* Reward Banner */}
        <section className={styles.rewardBanner}>
          <div className={styles.container}>
            <div className={styles.rewardInner}>
              <span className={styles.rewardEmoji}>⭐</span>
              <div>
                <h3 className={styles.rewardTitle}>Collect Stars & Badges!</h3>
                <p className={styles.rewardDesc}>
                  Watch educational videos and finish games to collect stars. Show your parents how smart you are!
                </p>
              </div>
              <Link href="/games" className={styles.rewardBtn}>
                Play Games Now!
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerLogo}>🎬 KidoTube</div>
          <p className={styles.footerText}>
            A safe, ad-free educational streaming and game portal for curious kids 💜
          </p>
          <div className={styles.footerLinks}>
            <Link href="/parent">👨‍👩‍👧 Parent Dashboard</Link>
            <Link href="/admin">🛠️ Admin Panel</Link>
            <Link href="/games">🎮 Games Zone</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
