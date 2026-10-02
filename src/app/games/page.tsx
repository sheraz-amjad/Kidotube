'use client';

import { useState } from 'react';
import ChildHeader from '@/components/ChildHeader';
import GameCard from '@/components/GameCard';
import { GAMES } from '@/lib/data';
import styles from './page.module.css';

export default function GamesPage() {
  const [filter, setFilter] = useState<'all' | 'learning' | 'creative' | 'puzzle' | 'arcade'>('all');

  const filteredGames = GAMES.filter((g) => {
    if (filter === 'learning') return g.category === 'math' || g.category === 'spelling';
    if (filter === 'creative') return g.category === 'coloring' || g.category === 'music';
    if (filter === 'puzzle') return g.category === 'puzzle' || g.category === 'memory';
    if (filter === 'arcade') return g.category === 'arcade';
    return true;
  });

  return (
    <div className={styles.page}>
      <ChildHeader />
      <main>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>✨ 9 Fun Educational Games</div>
            <h1 className={styles.title}>🎮 Games Zone</h1>
            <p className={styles.subtitle}>
              Play, learn, and earn +10 stars with every victory! Pick a game to start.
            </p>

            <div className={styles.filterRow}>
              {[
                { id: 'all',      label: 'All 9 Games 🌟' },
                { id: 'learning', label: 'Math & Words 📚' },
                { id: 'creative', label: 'Music & Art 🎨' },
                { id: 'puzzle',   label: 'Puzzles & Memory 🧩' },
                { id: 'arcade',   label: 'Action & Arcade 🦖' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.filterBtn} ${filter === tab.id ? styles.filterActive : ''}`}
                  onClick={() => setFilter(tab.id as typeof filter)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.grid}>
              {filteredGames.map((g, i) => (
                <GameCard key={g.id} game={g} delay={i * 70} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
