'use client';

import { useApp } from '@/lib/context';
import ChildHeader from '@/components/ChildHeader';
import VideoCard from '@/components/VideoCard';
import { getCategoryById, getVideosByCategory, ContentCategory } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { use, useState } from 'react';
import styles from './page.module.css';

function CategoryContent({ slug }: { slug: string }) {
  const category = getCategoryById(slug);
  const { isCategoryBlocked, customVideos, ageFilter } = useApp();
  const [langFilter, setLangFilter] = useState<'all' | 'english' | 'urdu' | 'hindi'>('all');

  if (!category) return notFound();

  // If this category is blocked by parent
  if (isCategoryBlocked(slug)) {
    return (
      <div className={styles.page}>
        <ChildHeader />
        <main>
          <div className={styles.container}>
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>🛡️</span>
              <h2>Category Locked by Parents</h2>
              <p>This category is currently locked in Parent Settings.</p>
              <Link href="/" className={styles.homeBtn}>
                Browse Other Categories
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const rawVideos = getVideosByCategory(slug as ContentCategory, customVideos);
  const videos = rawVideos.filter((v) => {
    if (langFilter !== 'all' && v.language !== langFilter && v.language !== 'both') return false;
    if (ageFilter !== 'all' && v.ageGroup !== 'all' && v.ageGroup !== ageFilter) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <ChildHeader />
      <main>
        {/* Header Banner */}
        <div className={styles.banner} style={{ background: category.bgGradient }}>
          <div className={styles.bannerInner}>
            <Link href="/" className={styles.back}>← Back to Home</Link>
            <div className={styles.bannerIcon}>{category.emoji}</div>
            <h1 className={styles.bannerTitle}>{category.label}</h1>
            <p className={styles.bannerDesc}>{category.description}</p>
            <span className={styles.bannerCount}>{videos.length} videos available</span>
          </div>
        </div>

        {/* Filter Bar */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              <button
                className={`${styles.homeBtn} ${langFilter === 'all' ? '' : styles.filterOutline}`}
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => setLangFilter('all')}
              >
                All Languages 🌐
              </button>
              <button
                className={`${styles.homeBtn} ${langFilter === 'english' ? '' : styles.filterOutline}`}
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => setLangFilter('english')}
              >
                🇬🇧 English
              </button>
              <button
                className={`${styles.homeBtn} ${langFilter === 'urdu' ? '' : styles.filterOutline}`}
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => setLangFilter('urdu')}
              >
                🇵🇰 Urdu
              </button>
              <button
                className={`${styles.homeBtn} ${langFilter === 'hindi' ? '' : styles.filterOutline}`}
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => setLangFilter('hindi')}
              >
                🇮🇳 Hindi
              </button>
            </div>

            {videos.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyEmoji}>📭</span>
                <h2>No videos match this filter!</h2>
                <p>Try switching language or check back later.</p>
                <button className={styles.homeBtn} onClick={() => setLangFilter('all')}>
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {videos.map((v, i) => (
                  <VideoCard key={v.id} video={v} delay={i * 60} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CategoryContent slug={slug} />;
}
