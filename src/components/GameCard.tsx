'use client';

import Link from 'next/link';
import { Game } from '@/lib/data';
import styles from './GameCard.module.css';

interface Props {
  game: Game;
  delay?: number;
}

export default function GameCard({ game, delay = 0 }: Props) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={styles.card}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.iconArea} style={{ background: game.bgGradient }}>
        <span className={styles.emoji}>{game.emoji}</span>
        <div className={styles.sparkle1}>✨</div>
        <div className={styles.sparkle2}>⭐</div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        <p className={styles.desc}>{game.description}</p>
        <div className={styles.playRow}>
          <span className={styles.ageTag}>Ages {game.ageGroup === 'all' ? '6–10' : game.ageGroup}</span>
          <button className={styles.playBtn} style={{ background: game.color }}>
            Play Now ▶
          </button>
        </div>
      </div>
    </Link>
  );
}
