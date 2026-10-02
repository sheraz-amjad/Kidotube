'use client';

import Link from 'next/link';
import { Video } from '@/lib/data';
import { useApp } from '@/lib/context';
import styles from './VideoCard.module.css';

interface Props {
  video: Video;
  delay?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  cartoons: '#FF6B9D',
  poems:    '#6C63FF',
  math:     '#FFD93D',
  science:  '#6BCB77',
  english:  '#4ECDC4',
  urdu:     '#FF9F43',
  hindi:    '#F97316',
};

export default function VideoCard({ video, delay = 0 }: Props) {
  const { isFavorite, toggleFavorite } = useApp();
  const accentColor = CATEGORY_COLORS[video.category] ?? '#6C63FF';
  const fav = isFavorite(video.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(video.id);
  };

  return (
    <Link
      href={`/watch/${video.id}`}
      className={styles.card}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.thumbWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={styles.thumb}
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
          onClick={handleFav}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Favorite"
        >
          {fav ? '💖' : '🤍'}
        </button>

        {/* Language Badge */}
        <span className={styles.langBadge}>
          {video.language === 'urdu'
            ? '🇵🇰 Urdu'
            : video.language === 'hindi'
            ? '🇮🇳 Hindi'
            : video.language === 'both'
            ? '🌐 Dual'
            : '🇬🇧 Eng'}
        </span>

        <div className={styles.overlay}>
          <div className={styles.playBtn}>▶</div>
        </div>
        <span className={styles.duration}>{video.durationMinutes} min</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{video.title}</h3>
        <div className={styles.meta}>
          <span
            className={styles.category}
            style={{ background: accentColor + '20', color: accentColor }}
          >
            {video.category}
          </span>
          <span className={styles.views}>👁 {video.views.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
