'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { sound } from '@/lib/sound';
import styles from './page.module.css';

const PRESET_STICKERS = [
  { emoji: '🎨', label: 'Artist' },
  { emoji: '🌟', label: 'Super Star' },
  { emoji: '👏', label: 'Bravo' },
  { emoji: '💖', label: 'Love' },
];

export default function KidsCornerPage() {
  const { kidsCornerPosts, reactToCornerPost, allowKidsCorner } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const approvedPosts = kidsCornerPosts.filter((p) => p.approved);
  const filteredPosts =
    selectedFilter === 'featured'
      ? approvedPosts.filter((p) => p.featured)
      : approvedPosts;

  const handleReact = (postId: string, sticker: string) => {
    sound.playStarSound();
    reactToCornerPost(postId, sticker);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header / Hero */}
        <section className={styles.hero}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎨 🌟 🤝</div>
          <h1 className={styles.heroTitle}>Safe Kids Corner</h1>
          <p className={styles.heroSub}>
            A safe, uplifting showcase created entirely by kids! All creations come directly
            from the Notebook with no camera photos, private nicknames, and kind sticker cheers.
          </p>
          <div className={styles.safetyPills}>
            <span className={styles.safetyPill}>🔒 100% In-App Art Only</span>
            <span className={styles.safetyPill}>🛡️ Pre-Moderated for Safety</span>
            <span className={styles.safetyPill}>🎭 Nicknames & Avatars Only</span>
            <span className={styles.safetyPill}>✨ Preset Sticker Reactions</span>
            <span className={styles.safetyPill}>🚫 Zero Ads & Zero DMs</span>
          </div>
        </section>

        {/* Parent Opt-In Notice if Disabled */}
        {!allowKidsCorner && (
          <div className={styles.optInNotice}>
            <div className={styles.optInTitle}>👨‍👩‍👧 Parent Permission Active</div>
            <p>
              Sharing your notebook drawings to Safe Kids Corner is currently set to private.
              Ask your parent to unlock posting permission in the <strong>Parent Dashboard</strong>!
            </p>
          </div>
        )}

        {/* Weekly Challenge Banner */}
        <div className={styles.challengeBanner}>
          <div>
            <span style={{ fontSize: 24, marginRight: 8 }}>🌳</span>
            <span className={styles.challengeTitle}>Weekly Creative Challenge: Dream Treehouse!</span>
            <div className={styles.challengeDesc}>
              Draw your imaginary treehouse with rope ladders, secret telescopes, and cozy rooms.
            </div>
          </div>
          <Link href="/notebook" className={styles.challengeBtn} onClick={() => sound.playClick()}>
            ✏️ Draw in Notebook
          </Link>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setSelectedFilter('all'); sound.playPop(); }}
              style={{
                padding: '8px 18px',
                borderRadius: 99,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                border: 'none',
                background: selectedFilter === 'all' ? 'var(--blue)' : 'var(--bg-card)',
                color: selectedFilter === 'all' ? '#fff' : 'var(--text-dark)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              🌈 All Masterpieces ({approvedPosts.length})
            </button>
            <button
              onClick={() => { setSelectedFilter('featured'); sound.playPop(); }}
              style={{
                padding: '8px 18px',
                borderRadius: 99,
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
                border: 'none',
                background: selectedFilter === 'featured' ? '#F59E0B' : 'var(--bg-card)',
                color: selectedFilter === 'featured' ? '#fff' : 'var(--text-dark)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              ⭐ Featured of the Week ({approvedPosts.filter(p => p.featured).length})
            </button>
          </div>

          <Link
            href="/notebook"
            style={{
              fontWeight: 800,
              fontSize: 14,
              color: 'var(--coral)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📓 Open My Notebook & Gallery</span> →
          </Link>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 24, border: '2px dashed var(--border)' }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎨</div>
            <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, marginBottom: 8 }}>No artworks here yet!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
              Be the first artist! Open your Notebook, draw something wonderful, and tap &ldquo;Share to Kids Corner&rdquo;.
            </p>
            <Link href="/notebook" className={styles.challengeBtn} onClick={() => sound.playClick()}>
              ✨ Start Drawing Now
            </Link>
          </div>
        ) : (
          <div className={styles.cornerGrid}>
            {filteredPosts.map((post) => (
              <article key={post.id} className={styles.postCard}>
                {post.featured && (
                  <div className={styles.featuredBadge}>
                    🌟 Featured of the Week
                  </div>
                )}

                <div className={styles.postArtworkWrapper}>
                  {post.artworkUrl ? (
                    <img
                      src={post.artworkUrl}
                      alt={post.title}
                      className={styles.postArtwork}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.artworkPlaceholder}>
                      {post.category === 'Space' ? '🚀' : post.category === 'Animals' ? '🐘' : '🎨'}
                    </div>
                  )}
                </div>

                <div className={styles.postBody}>
                  <div className={styles.authorRow}>
                    <div className={styles.authorAvatar}>
                      {post.childAvatar || '🧒'}
                    </div>
                    <div>
                      <div className={styles.authorName}>{post.childNickname}</div>
                      <div className={styles.postCategory}>🏷️ {post.category || 'Artwork'}</div>
                    </div>
                  </div>

                  <h3 className={styles.postTitle}>{post.title}</h3>

                  {/* Preset Sticker Reactions */}
                  <div className={styles.stickerBar}>
                    {PRESET_STICKERS.map((stk) => {
                      const count = post.stickerReactions?.[stk.emoji] || 0;
                      return (
                        <button
                          key={stk.emoji}
                          type="button"
                          className={styles.stickerBtn}
                          onClick={() => handleReact(post.id, stk.emoji)}
                          title={`React with ${stk.label}`}
                          aria-label={`React with ${stk.label}`}
                        >
                          <span>{stk.emoji}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
