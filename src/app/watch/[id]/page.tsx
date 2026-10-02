'use client';

import { useApp } from '@/lib/context';
import ChildHeader from '@/components/ChildHeader';
import { getVideoById, getCategoryById, getAllVideos } from '@/lib/data';
import { sound } from '@/lib/sound';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import styles from './page.module.css';

function WatchContent({ videoId }: { videoId: string }) {
  const {
    addToHistory,
    isScreenTimeLocked,
    isBedtimeActive,
    stars,
    isCategoryBlocked,
    isFavorite,
    toggleFavorite,
    reactions,
    addReaction,
    customVideos,
  } = useApp();

  const video = getVideoById(videoId, customVideos);
  const category = video ? getCategoryById(video.category) : undefined;
  const [watched, setWatched] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [theaterMode, setTheaterMode] = useState(false);
  const [showRestEyes, setShowRestEyes] = useState(false);

  const fav = video ? isFavorite(video.id) : false;
  const videoReactions = video && reactions[video.id] ? reactions[video.id] : {};

  // Record history & award stars after 5s
  useEffect(() => {
    if (video && !watched) {
      const timer = setTimeout(() => {
        addToHistory({
          videoId: video.id,
          title: video.title,
          category: video.category,
          watchedAt: new Date().toISOString(),
          durationMinutes: video.durationMinutes,
        });
        sound.playStar();
        setStarsEarned(2);
        setWatched(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [video, watched, addToHistory]);

  // Eye rest reminder timer (simulated: triggers after 25s for kids)
  useEffect(() => {
    const eyeTimer = setTimeout(() => {
      setShowRestEyes(true);
    }, 25000);
    return () => clearTimeout(eyeTimer);
  }, []);

  if (!video) {
    return (
      <div className={styles.error}>
        <span>😕</span>
        <h2>Video not found</h2>
        <Link href="/">Go Home</Link>
      </div>
    );
  }

  // Check if category is blocked by parent
  if (isCategoryBlocked(video.category)) {
    return (
      <div className={styles.locked}>
        <div className={styles.lockedCard}>
          <span className={styles.lockedEmoji}>🛡️</span>
          <h2>Category Locked</h2>
          <p>
            This video is in the <strong>{video.category}</strong> category, which has been locked by your parents.
          </p>
          <Link href="/" className={styles.parentLink}>
            Explore Other Videos
          </Link>
        </div>
      </div>
    );
  }

  // Bedtime lock
  if (isBedtimeActive) {
    return (
      <div className={styles.locked}>
        <div className={styles.lockedCard}>
          <span className={styles.lockedEmoji}>🌙 😴</span>
          <h2>Bedtime Mode Active!</h2>
          <p>
            It is bedtime now. Time to rest your eyes, relax, and get ready for a wonderful day tomorrow!
          </p>
          <Link href="/parent" className={styles.parentLink}>
            Parent PIN Unlock
          </Link>
        </div>
      </div>
    );
  }

  // Screen time lock
  if (isScreenTimeLocked) {
    return (
      <div className={styles.locked}>
        <div className={styles.lockedCard}>
          <span className={styles.lockedEmoji}>⏰ 🦕</span>
          <h2>Screen Time is Up!</h2>
          <p>You&apos;ve had your screen time for today. Take a break and come back tomorrow! 🌙</p>
          <Link href="/parent" className={styles.parentLink}>
            Parent Settings
          </Link>
        </div>
      </div>
    );
  }

  const allVids = getAllVideos(customVideos);
  const related = allVids
    .filter((v) => v.category === video.category && v.id !== video.id && !isCategoryBlocked(v.category))
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <ChildHeader />
      <main>
        <div className={styles.container}>
          <Link href={`/category/${video.category}`} className={styles.back}>
            ← Back to {category?.label || video.category}
          </Link>

          <div className={`${styles.layout} ${theaterMode ? styles.layoutTheater : ''}`}>
            {/* Player Side */}
            <div className={styles.playerSide}>
              {/* Stars earned toast */}
              {starsEarned > 0 && (
                <div className={styles.toast}>
                  ⭐ +{starsEarned} stars earned for learning! Total stars: {stars} 🌟
                </div>
              )}

              <div className={`${styles.playerWrapper} ${theaterMode ? styles.playerTheater : ''}`}>
                <iframe
                  key={video.youtubeId}
                  id={`yt-player-${video.id}`}
                  className={styles.player}
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* Video Info Card */}
              <div className={styles.videoInfo}>
                <div className={styles.videoMeta}>
                  <span className={styles.categoryBadge}>
                    {category?.emoji ?? '🎬'} {video.category}
                  </span>
                  <span className={styles.ageBadge}>
                    Ages {video.ageGroup === 'all' ? '6–10' : video.ageGroup}
                  </span>
                  <span className={styles.langBadge}>
                    {video.language === 'urdu' ? '🇵🇰 Urdu' : '🇬🇧 English'}
                  </span>

                  {/* Actions: Favorite, Speak, & Theater Mode */}
                  <div className={styles.watchActions}>
                    <button
                      className={styles.actionPill}
                      onClick={() => {
                        sound.playPop();
                        sound.speak(video.title + '. ' + video.description);
                      }}
                      title="Read aloud for early learners"
                    >
                      <span>🗣️ Read Aloud</span>
                    </button>

                    <button
                      className={`${styles.actionPill} ${fav ? styles.actionPillActive : ''}`}
                      onClick={() => toggleFavorite(video.id)}
                    >
                      <span>{fav ? '💖 Saved' : '🤍 Favorite'}</span>
                    </button>

                    <button
                      className={styles.actionPill}
                      onClick={() => {
                        sound.playPop();
                        setTheaterMode(!theaterMode);
                      }}
                    >
                      <span>{theaterMode ? '🖥️ Standard' : '🎬 Big Screen'}</span>
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionPill}
                      title="Watch on YouTube directly"
                    >
                      <span>▶️ YouTube App</span>
                    </a>
                  </div>
                </div>

                <h1 className={styles.videoTitle}>{video.title}</h1>
                <p className={styles.videoDesc}>{video.description}</p>

                <div className={styles.videoStats}>
                  <span>👁 {video.views.toLocaleString()} views</span>
                  <span>⏱ {video.durationMinutes} min</span>
                  <span>⭐ +2 stars awarded</span>
                </div>

                {/* Safe Kids Reaction Buttons */}
                <div className={styles.reactionSection}>
                  <span className={styles.reactionLabel}>How did you like it?</span>
                  {[
                    { emoji: '❤️', label: 'Love it' },
                    { emoji: '😂', label: 'Funny' },
                    { emoji: '💡', label: 'Smart' },
                    { emoji: '🌟', label: 'Super' },
                  ].map((r) => (
                    <button
                      key={r.emoji}
                      className={styles.reactionBtn}
                      onClick={() => addReaction(video.id, r.emoji)}
                    >
                      <span>{r.emoji}</span>
                      <span>{r.label}</span>
                      {videoReactions[r.emoji] ? (
                        <span>({videoReactions[r.emoji]})</span>
                      ) : null}
                    </button>
                  ))}
                </div>

                {/* Friendly Rest Eyes Reminder */}
                {showRestEyes && (
                  <div className={styles.restEyesBanner}>
                    <span>👀 🧘</span>
                    <span>
                      Friendly Health Tip: Blink your eyes, look far away at something green, and roll your shoulders!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Side */}
            {related.length > 0 && (
              <aside className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>🎬 Up Next</h2>
                <div className={styles.relatedList}>
                  {related.map((v) => (
                    <Link
                      key={v.id}
                      href={`/watch/${v.id}`}
                      className={styles.relatedItem}
                      onClick={() => sound.playPop()}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.thumbnail} alt={v.title} className={styles.relatedThumb} />
                      <div className={styles.relatedInfo}>
                        <p className={styles.relatedTitle}>{v.title}</p>
                        <span className={styles.relatedDur}>{v.durationMinutes} min</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <WatchContent videoId={id} />;
}
