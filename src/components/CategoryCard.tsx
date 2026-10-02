'use client';

import Link from 'next/link';
import { Category } from '@/lib/data';
import { useApp } from '@/lib/context';
import styles from './CategoryCard.module.css';

interface Props {
  category: Category;
  videoCount: number;
  delay?: number;
}

export default function CategoryCard({ category, videoCount, delay = 0 }: Props) {
  const { blockedCategories } = useApp();
  const isBlocked = blockedCategories.includes(category.id);

  return (
    <Link
      href={isBlocked ? '#' : `/category/${category.id}`}
      className={`${styles.card} ${isBlocked ? styles.blocked : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-disabled={isBlocked}
    >
      <div className={styles.iconWrapper} style={{ background: category.iconBg }}>
        <span className={styles.emoji}>{category.emoji}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.label}>{category.label}</h3>
        <p className={styles.description}>{category.description}</p>
        <span className={styles.count}>{videoCount} videos</span>
      </div>
      {isBlocked && <div className={styles.blockedOverlay}>🔒 Blocked by Parent</div>}
      <div className={styles.arrow}>→</div>
    </Link>
  );
}
