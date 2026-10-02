'use client';

import { useApp } from '@/lib/context';
import ChildHeader from '@/components/ChildHeader';
import { GAMES } from '@/lib/data';
import { sound } from '@/lib/sound';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef, use } from 'react';
import styles from './page.module.css';

// ============================================================
// 1. Memory Match Game
// ============================================================
const MEMORY_EMOJIS = ['🐶','🐱','🐼','🦊','🐸','🦁','🐨','🦋'];

interface MemCard { id: number; emoji: string; flipped: boolean; matched: boolean; }

function MemoryGame({ onWin }: { onWin: () => void }) {
  const [cards, setCards] = useState<MemCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initCards = useCallback(() => {
    const pairs = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(pairs);
    setSelected([]);
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => { initCards(); }, [initCards]);

  const flip = (idx: number) => {
    if (selected.length === 2) return;
    if (cards[idx].flipped || cards[idx].matched) return;

    sound.playPop();

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newSel = [...selected, idx];
    setSelected(newSel);

    if (newSel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSel;
      if (newCards[a].emoji === newCards[b].emoji) {
        newCards[a].matched = true;
        newCards[b].matched = true;
        setCards([...newCards]);
        setSelected([]);
        sound.playStar();
        if (newCards.every((c) => c.matched)) {
          setWon(true);
          sound.playWin();
          onWin();
        }
      } else {
        setTimeout(() => {
          newCards[a].flipped = false;
          newCards[b].flipped = false;
          setCards([...newCards]);
          setSelected([]);
        }, 800);
      }
    }
  };

  if (won) return (
    <div className={styles.winScreen}>
      <div className={styles.winEmoji}>🎉</div>
      <h2 className={styles.winTitle}>You Won!</h2>
      <p className={styles.winMoves}>Completed in <strong>{moves}</strong> moves</p>
      <button className={styles.playAgainBtn} onClick={initCards}>Play Again 🔄</button>
    </div>
  );

  return (
    <div className={styles.memoryGame}>
      <div className={styles.gameStats}>
        <span className={styles.statBadge}>🎯 Moves: {moves}</span>
        <span className={styles.statBadge}>
          ✅ Matched: {cards.filter(c => c.matched).length / 2} / {MEMORY_EMOJIS.length}
        </span>
      </div>
      <div className={styles.memGrid}>
        {cards.map((card, i) => (
          <button
            key={card.id}
            className={`${styles.memCard} ${card.flipped || card.matched ? styles.memFlipped : ''} ${card.matched ? styles.memMatched : ''}`}
            onClick={() => flip(i)}
            aria-label={card.flipped || card.matched ? card.emoji : 'Hidden card'}
          >
            <div className={styles.memCardInner}>
              <div className={styles.memFront}>❓</div>
              <div className={styles.memBack}>{card.emoji}</div>
            </div>
          </button>
        ))}
      </div>
      <button className={styles.resetBtn} onClick={initCards}>🔄 Reset</button>
    </div>
  );
}

// ============================================================
// 2. Math Quiz Game
// ============================================================
function MathQuiz({ onWin }: { onWin: () => void }) {
  const genQ = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = ['+', '-'][Math.floor(Math.random() * 2)];
    const ans = op === '+' ? a + b : Math.abs(a - b);
    const fa = op === '-' ? Math.max(a, b) : a;
    const fb = op === '-' ? Math.min(a, b) : b;
    return { question: `${fa} ${op} ${fb} = ?`, answer: ans };
  };

  const [{ question, answer }, setQ] = useState(genQ);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const check = () => {
    if (!input.trim()) return;
    if (parseInt(input) === answer) {
      sound.playStar();
      setStatus('correct');
      const newScore = score + 1;
      setScore(newScore);
      setTotal((t) => t + 1);
      if (newScore >= 5) {
        sound.playWin();
        onWin();
      }
      setTimeout(() => { setQ(genQ()); setInput(''); setStatus('idle'); }, 800);
    } else {
      sound.playWrong();
      setStatus('wrong');
      setTotal((t) => t + 1);
      setTimeout(() => { setInput(''); setStatus('idle'); }, 800);
    }
  };

  return (
    <div className={styles.mathGame}>
      <div className={styles.gameStats}>
        <span className={styles.statBadge}>⭐ Score: {score}/5</span>
        <span className={styles.statBadge}>📝 Questions: {total}</span>
      </div>
      <div className={`${styles.mathCard} ${status === 'correct' ? styles.correct : status === 'wrong' ? styles.wrong : ''}`}>
        <p className={styles.mathQ}>{question}</p>
        <input
          className={styles.mathInput}
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder="Your answer..."
          id="math-answer"
        />
        <button className={styles.checkBtn} onClick={check}>Check ✅</button>
        {status === 'correct' && <div className={styles.feedback}>✅ Correct! Great job!</div>}
        {status === 'wrong'   && <div className={styles.feedbackWrong}>❌ Try again! The answer was {answer}</div>}
      </div>
      <p className={styles.hint}>Get 5 correct answers to win stars! 🏆</p>
    </div>
  );
}

// ============================================================
// 3. Spelling Bee Game
// ============================================================
const WORDS = [
  { word: 'CAT', hint: '🐱' }, { word: 'DOG', hint: '🐶' },
  { word: 'SUN', hint: '☀️' }, { word: 'FISH', hint: '🐟' },
  { word: 'BIRD', hint: '🐦' }, { word: 'TREE', hint: '🌳' },
  { word: 'STAR', hint: '⭐' }, { word: 'MOON', hint: '🌙' },
];

function SpellingBee({ onWin }: { onWin: () => void }) {
  const [idx, setIdx] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const w = WORDS[idx].word.split('');
    setLetters([...w].sort(() => Math.random() - 0.5));
    setAnswer([]);
    setStatus('idle');
  }, [idx]);

  const addLetter = (l: string, li: number) => {
    if (status !== 'idle') return;
    sound.playPop();
    setAnswer([...answer, l]);
    setLetters(letters.filter((_, i) => i !== li));
  };

  const removeAnswer = (i: number) => {
    if (status !== 'idle') return;
    sound.playPop();
    const rem = answer[i];
    setAnswer(answer.filter((_, j) => j !== i));
    setLetters([...letters, rem]);
  };

  const checkSpelling = () => {
    if (answer.join('') === WORDS[idx].word) {
      sound.playStar();
      setStatus('correct');
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= 5) {
        sound.playWin();
        onWin();
        return;
      }
      setTimeout(() => setIdx((i) => (i + 1) % WORDS.length), 900);
    } else {
      sound.playWrong();
      setStatus('wrong');
      setTimeout(() => { setStatus('idle'); }, 800);
    }
  };

  const current = WORDS[idx];

  return (
    <div className={styles.spellingGame}>
      <div className={styles.gameStats}>
        <span className={styles.statBadge}>⭐ Score: {score}/5</span>
      </div>
      <div className={styles.spellingCard}>
        <span className={styles.spellingHint}>{current.hint}</span>
        <p className={styles.spellingClue}>Spell this word!</p>

        {/* Answer slots */}
        <div className={styles.answerRow}>
          {answer.map((l, i) => (
            <button key={i} className={styles.answerTile} onClick={() => removeAnswer(i)}>{l}</button>
          ))}
          {Array(current.word.length - answer.length).fill(null).map((_, i) => (
            <div key={i} className={styles.emptyTile} />
          ))}
        </div>

        {/* Letter pool */}
        <div className={styles.letterRow}>
          {letters.map((l, i) => (
            <button key={i} className={styles.letterTile} onClick={() => addLetter(l, i)}>{l}</button>
          ))}
        </div>

        <button className={styles.checkBtn} onClick={checkSpelling} disabled={answer.length !== current.word.length}>
          Check ✅
        </button>
        {status === 'correct' && <div className={styles.feedback}>✅ Correct!</div>}
        {status === 'wrong'   && <div className={styles.feedbackWrong}>❌ Try again!</div>}
      </div>
    </div>
  );
}

// ============================================================
// 4. Coloring Book Game (Canvas + Templates + Stamps)
// ============================================================
const PALETTE = [
  '#FF6B6B', '#FF6B9D', '#9B51E0', '#4A90E2',
  '#00CEC9', '#2ECC71', '#F1C40F', '#E67E22',
  '#E74C3C', '#8D6E63', '#2C3E50', '#FFFFFF',
];

const TEMPLATES = [
  { id: 'cat', emoji: '🐱', name: 'Cute Kitten' },
  { id: 'rocket', emoji: '🚀', name: 'Space Rocket' },
  { id: 'fish', emoji: '🐠', name: 'Bubble Fish' },
  { id: 'flower', emoji: '🌸', name: 'Flower Garden' },
  { id: 'blank', emoji: '✨', name: 'Free Draw' },
];

const STAMPS = ['⭐', '💖', '🌈', '👑', '🎈', '🦄', '🚀', '🌸'];

function ColoringBook({ onWin }: { onWin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');
  const [brushSize, setBrushSize] = useState(10);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [template, setTemplate] = useState('cat');

  // Draw template outlines
  const drawTemplate = useCallback((tpl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (tpl === 'cat') {
      // Cat Head
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.stroke();
      // Ears
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy - 45);
      ctx.lineTo(cx - 70, cy - 110);
      ctx.lineTo(cx - 20, cy - 65);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 20, cy - 65);
      ctx.lineTo(cx + 70, cy - 110);
      ctx.lineTo(cx + 50, cy - 45);
      ctx.stroke();
      // Eyes
      ctx.fillStyle = '#4B5563';
      ctx.beginPath();
      ctx.arc(cx - 25, cy - 10, 8, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 10, 8, 0, Math.PI * 2);
      ctx.fill();
      // Nose
      ctx.beginPath();
      ctx.arc(cx, cy + 15, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (tpl === 'rocket') {
      // Rocket body
      ctx.beginPath();
      ctx.moveTo(cx, cy - 110);
      ctx.quadraticCurveTo(cx + 60, cy, cx + 45, cy + 70);
      ctx.lineTo(cx - 45, cy + 70);
      ctx.quadraticCurveTo(cx - 60, cy, cx, cy - 110);
      ctx.stroke();
      // Window
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 25, 0, Math.PI * 2);
      ctx.stroke();
      // Fins
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy + 40);
      ctx.lineTo(cx - 85, cy + 90);
      ctx.lineTo(cx - 45, cy + 70);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 45, cy + 40);
      ctx.lineTo(cx + 85, cy + 90);
      ctx.lineTo(cx + 45, cy + 70);
      ctx.stroke();
    } else if (tpl === 'fish') {
      // Fish Body
      ctx.beginPath();
      ctx.ellipse(cx - 20, cy, 90, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Tail
      ctx.beginPath();
      ctx.moveTo(cx + 60, cy);
      ctx.lineTo(cx + 120, cy - 50);
      ctx.lineTo(cx + 120, cy + 50);
      ctx.closePath();
      ctx.stroke();
      // Eye
      ctx.fillStyle = '#4B5563';
      ctx.beginPath();
      ctx.arc(cx - 65, cy - 15, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (tpl === 'flower') {
      // Petals
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = cx + Math.cos(angle) * 55;
        const py = cy - 20 + Math.sin(angle) * 55;
        ctx.beginPath();
        ctx.arc(px, py, 35, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Center
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy + 10);
      ctx.lineTo(cx, cy + 110);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    drawTemplate(template);
  }, [template, drawTemplate]);

  // Canvas coordinates
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCoordinates(e);

    if (selectedStamp) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedStamp, x, y);
        sound.playPop();
        if (!hasDrawn) {
          setHasDrawn(true);
          onWin();
        }
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (!hasDrawn) {
      setHasDrawn(true);
      onWin();
    }
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const downloadArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playStar();
    const link = document.createElement('a');
    link.download = `kidotube-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const clearCanvas = () => {
    sound.playPop();
    drawTemplate(template);
  };

  return (
    <div className={styles.coloringGame}>
      <div className={styles.coloringCard}>
        {/* Template choices */}
        <div className={styles.templateRow}>
          <span className={styles.templateLabel}>🎨 Template:</span>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`${styles.templateBtn} ${template === t.id ? styles.templateActive : ''}`}
              onClick={() => {
                sound.playPop();
                setTemplate(t.id);
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={580}
            height={380}
            className={styles.coloringCanvas}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        {/* Tools and Palette */}
        <div className={styles.toolSection}>
          {/* Colors */}
          <div className={styles.paletteRow}>
            {PALETTE.map((c) => (
              <button
                key={c}
                className={`${styles.colorSwatch} ${selectedColor === c && !selectedStamp ? styles.swatchActive : ''}`}
                style={{ background: c }}
                onClick={() => {
                  sound.playPop();
                  setSelectedColor(c);
                  setSelectedStamp(null);
                }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>

          {/* Brush Sizes */}
          <div className={styles.brushRow}>
            <span className={styles.templateLabel}>🖌️ Brush:</span>
            {[
              { size: 5, label: 'Fine' },
              { size: 12, label: 'Medium' },
              { size: 24, label: 'Big' },
              { size: 40, label: 'Jumbo' },
            ].map((b) => (
              <button
                key={b.size}
                className={`${styles.sizeBtn} ${brushSize === b.size && !selectedStamp ? styles.sizeActive : ''}`}
                onClick={() => {
                  sound.playPop();
                  setBrushSize(b.size);
                  setSelectedStamp(null);
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Sticker Stamps */}
          <div className={styles.stampsRow}>
            <span className={styles.templateLabel}>⭐ Stamps:</span>
            {STAMPS.map((st) => (
              <button
                key={st}
                className={`${styles.stampBtn} ${selectedStamp === st ? styles.stampActive : ''}`}
                onClick={() => {
                  sound.playPop();
                  setSelectedStamp(selectedStamp === st ? null : st);
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={styles.canvasActions}>
            <button className={styles.actionBtn} onClick={clearCanvas}>
              🗑️ Clear
            </button>
            <button className={`${styles.actionBtn} ${styles.saveArtBtn}`} onClick={downloadArt}>
              💾 Save My Art
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 5. Animal Puzzle Game (Jigsaw Tile Swap)
// ============================================================
const PUZZLE_ANIMALS = [
  { id: 'lion', name: 'Lion', emoji: '🦁', tiles: ['🦁', '👑', '🐾', '🌿', '🌅', '🌾', '🐾', '🦁', '⭐'] },
  { id: 'panda', name: 'Panda', emoji: '🐼', tiles: ['🐼', '🎋', '🍃', '🐼', '🎍', '🎋', '🍃', '🐼', '⭐'] },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', tiles: ['🐘', '💧', '🌴', '🐘', '🌾', '💧', '🌴', '🐘', '⭐'] },
];

function AnimalPuzzle({ onWin }: { onWin: () => void }) {
  const [animalIdx, setAnimalIdx] = useState(0);
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const curAnimal = PUZZLE_ANIMALS[animalIdx];

  const scramble = useCallback(() => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
    setTiles(arr);
    setSelectedTile(null);
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => {
    scramble();
  }, [animalIdx, scramble]);

  const handleTileClick = (idx: number) => {
    if (won) return;
    sound.playPop();

    if (selectedTile === null) {
      setSelectedTile(idx);
    } else {
      const newTiles = [...tiles];
      const temp = newTiles[selectedTile];
      newTiles[selectedTile] = newTiles[idx];
      newTiles[idx] = temp;
      setTiles(newTiles);
      setSelectedTile(null);
      setMoves((m) => m + 1);

      // Check if sorted [0, 1, 2, 3, 4, 5, 6, 7, 8]
      const isSorted = newTiles.every((val, i) => val === i);
      if (isSorted) {
        setWon(true);
        sound.playWin();
        onWin();
      }
    }
  };

  return (
    <div className={styles.puzzleGame}>
      <div className={styles.puzzleCard}>
        {/* Animal selector */}
        <div className={styles.animalPicker}>
          {PUZZLE_ANIMALS.map((a, i) => (
            <button
              key={a.id}
              className={`${styles.animalOption} ${animalIdx === i ? styles.animalOptionActive : ''}`}
              onClick={() => {
                sound.playPop();
                setAnimalIdx(i);
              }}
            >
              <span>{a.emoji}</span>
              <span>{a.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.gameStats}>
          <span className={styles.statBadge}>🎯 Moves: {moves}</span>
          <span className={styles.statBadge}>🧩 Tap 2 tiles to swap</span>
        </div>

        {won ? (
          <div className={styles.winScreen}>
            <div className={styles.winEmoji}>🎉</div>
            <h2 className={styles.winTitle}>Puzzle Solved!</h2>
            <p className={styles.winMoves}>You put the {curAnimal.name} together in {moves} moves!</p>
            <button className={styles.playAgainBtn} onClick={scramble}>
              Play Again 🔄
            </button>
          </div>
        ) : (
          <div className={styles.puzzleGrid}>
            {tiles.map((val, pos) => (
              <button
                key={pos}
                className={`${styles.puzzleTile} ${selectedTile === pos ? styles.tileSelected : ''}`}
                onClick={() => handleTileClick(pos)}
              >
                <span className={styles.tileNum}>{val + 1}</span>
                <span>{curAnimal.tiles[val]}</span>
              </button>
            ))}
          </div>
        )}

        <button className={styles.resetBtn} onClick={scramble}>
          🔄 Scramble
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 6. Balloon Pop Game (Fun sensory reflexes)
// ============================================================
interface Balloon {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
}

const BALLOON_EMOJIS = ['🎈', '🔴', '🟡', '🟢', '🔵', '🟣', '🟠'];

function BalloonPop({ onWin }: { onWin: () => void }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const nextId = useRef(1);

  // Spawn balloons
  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 8) return prev;
        const newBalloon: Balloon = {
          id: nextId.current++,
          emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
          x: Math.floor(Math.random() * 80) + 10,
          y: 380,
          speed: Math.random() * 2 + 1.5,
        };
        return [...prev, newBalloon];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [won]);

  // Float balloons upwards
  useEffect(() => {
    if (won) return;
    const anim = setInterval(() => {
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -50)
      );
    }, 40);

    return () => clearInterval(anim);
  }, [won]);

  const pop = (id: number) => {
    sound.playPop();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    const newScore = score + 10;
    setScore(newScore);

    if (newScore >= 100) {
      setWon(true);
      sound.playWin();
      onWin();
    }
  };

  const restart = () => {
    setScore(0);
    setWon(false);
    setBalloons([]);
  };

  return (
    <div className={styles.balloonGame}>
      <div className={styles.gameStats}>
        <span className={styles.statBadge}>⭐ Score: {score}/100</span>
        <span className={styles.statBadge}>🎈 Tap balloons to pop!</span>
      </div>

      <div className={styles.balloonCard}>
        <div className={styles.cloud1}>☁️</div>
        <div className={styles.cloud2}>☁️</div>
        <div className={styles.cloud3}>☁️</div>

        {balloons.map((b) => (
          <button
            key={b.id}
            className={styles.balloonItem}
            style={{ left: `${b.x}%`, top: `${b.y}px` }}
            onClick={() => pop(b.id)}
          >
            {b.emoji}
          </button>
        ))}

        {won && (
          <div className={styles.popOverlay}>
            <div className={styles.winEmoji}>🏆</div>
            <h2 className={styles.winTitle}>Super Popper!</h2>
            <p className={styles.winMoves}>You reached 100 points!</p>
            <button className={styles.playAgainBtn} onClick={restart}>
              Play Again 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 7. Magic Piano Game (Real Musical Keys & Song Guides)
// ============================================================
const PIANO_NOTES = [
  { note: 'C',  sol: 'Do', freq: 261.63, color: '#FF7675' },
  { note: 'D',  sol: 'Re', freq: 293.66, color: '#FF9F43' },
  { note: 'E',  sol: 'Mi', freq: 329.63, color: '#FFD93D' },
  { note: 'F',  sol: 'Fa', freq: 349.23, color: '#6BCB77' },
  { note: 'G',  sol: 'So', freq: 392.00, color: '#4ECDC4' },
  { note: 'A',  sol: 'La', freq: 440.00, color: '#6C63FF' },
  { note: 'B',  sol: 'Ti', freq: 493.88, color: '#A29BFE' },
  { note: 'C5', sol: 'Do', freq: 523.25, color: '#FF6B9D' },
];

const SONGS = [
  { id: 'twinkle', name: 'Twinkle Star ⭐', notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G'] },
  { id: 'happy',   name: 'Happy Birthday 🎂', notes: ['C', 'C', 'D', 'C', 'F', 'E'] },
  { id: 'free',    name: 'Free Play 🎶', notes: [] },
];

function MagicPiano({ onWin }: { onWin: () => void }) {
  const [songIdx, setSongIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const { unlockBadge } = useApp();

  const curSong = SONGS[songIdx];
  const targetNote = curSong.notes.length > 0 ? curSong.notes[step] : null;

  const playKey = (note: typeof PIANO_NOTES[0]) => {
    sound.playNote(note.freq, 0.5);
    setActiveKey(note.note);
    setTimeout(() => setActiveKey(null), 200);

    if (curSong.notes.length > 0) {
      if (note.note === targetNote) {
        const nextStep = step + 1;
        if (nextStep >= curSong.notes.length) {
          setWon(true);
          sound.playWin();
          unlockBadge('piano_maestro');
          onWin();
        } else {
          setStep(nextStep);
        }
      }
    }
  };

  const restartSong = (idx: number) => {
    setSongIdx(idx);
    setStep(0);
    setWon(false);
  };

  return (
    <div className={styles.pianoGame}>
      <div className={styles.pianoCard}>
        {/* Song Selector */}
        <div className={styles.songSelector}>
          {SONGS.map((s, i) => (
            <button
              key={s.id}
              className={`${styles.songBtn} ${songIdx === i ? styles.songBtnActive : ''}`}
              onClick={() => restartSong(i)}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Guidance Prompt */}
        {targetNote && !won && (
          <div className={styles.songGuide}>
            🎶 Play Note: <strong style={{ fontSize: '20px', color: '#6C5CE7' }}>{targetNote}</strong> ({step + 1}/{curSong.notes.length})
          </div>
        )}

        {won ? (
          <div className={styles.winScreen}>
            <div className={styles.winEmoji}>🎵 🏆</div>
            <h2 className={styles.winTitle}>Musical Maestro!</h2>
            <p className={styles.winMoves}>You played {curSong.name} beautifully!</p>
            <button className={styles.playAgainBtn} onClick={() => restartSong(songIdx)}>
              Play Again 🔄
            </button>
          </div>
        ) : (
          <div className={styles.pianoKeys}>
            {PIANO_NOTES.map((k) => {
              const isTarget = targetNote === k.note;
              const isPressed = activeKey === k.note;
              return (
                <button
                  key={k.note}
                  className={`${styles.pianoKey} ${isPressed ? styles.pianoKeyActive : ''}`}
                  style={{
                    background: isTarget ? `linear-gradient(180deg, #FFFFFF, ${k.color})` : k.color,
                    outline: isTarget ? '3px solid #FEF08A' : 'none',
                  }}
                  onClick={() => playKey(k)}
                >
                  <span className={styles.keySolfege}>{k.sol}</span>
                  <span>{k.note}</span>
                </button>
              );
            })}
          </div>
        )}

        <p className={styles.hint}>Tip: Tap the colorful keys to hear musical notes!</p>
      </div>
    </div>
  );
}

// ============================================================
// 8. Dino Runner Game (Obstacle Jump & Physics)
// ============================================================
function DinoRunner({ onWin }: { onWin: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const { unlockBadge } = useApp();

  const gameState = useRef({
    dinoY: 170,
    velocityY: 0,
    isJumping: false,
    obstacles: [] as { x: number; emoji: string }[],
    groundOffset: 0,
    running: true,
  });

  const jump = useCallback(() => {
    if (!gameState.current.isJumping && gameState.current.running) {
      sound.playPop();
      gameState.current.velocityY = -13;
      gameState.current.isJumping = true;
    }
  }, []);

  const resetGame = () => {
    gameState.current = {
      dinoY: 170,
      velocityY: 0,
      isJumping: false,
      obstacles: [{ x: 500, emoji: '🌵' }],
      groundOffset: 0,
      running: true,
    };
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resetGame();
    let frameId: number;
    let spawnTimer = 0;

    const loop = () => {
      if (!gameState.current.running) return;

      const state = gameState.current;

      // Update Physics
      state.dinoY += state.velocityY;
      state.velocityY += 0.7; // Gravity
      if (state.dinoY >= 170) {
        state.dinoY = 170;
        state.velocityY = 0;
        state.isJumping = false;
      }

      // Move obstacles
      spawnTimer++;
      if (spawnTimer > 90) {
        spawnTimer = 0;
        const emojis = ['🌵', '🪨', '🌿', '🪵'];
        state.obstacles.push({
          x: 620,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }

      state.obstacles.forEach((obs) => {
        obs.x -= 4.5;
      });
      state.obstacles = state.obstacles.filter((obs) => obs.x > -40);

      // Collision Detection
      for (const obs of state.obstacles) {
        if (obs.x > 35 && obs.x < 85 && state.dinoY > 135) {
          state.running = false;
          sound.playWrong();
          setGameOver(true);
          return;
        }
      }

      // Score increment
      setScore((s) => {
        const next = s + 1;
        if (next >= 100 && !won) {
          sound.playWin();
          unlockBadge('dino_jumper');
          onWin();
          setWon(true);
        }
        return next;
      });

      // Clear & Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.font = '28px sans-serif';
      ctx.fillText('☁️', 120, 50);
      ctx.fillText('☁️', 380, 70);

      // Ground Line
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 208);
      ctx.lineTo(600, 208);
      ctx.stroke();

      // Dino
      ctx.font = '44px sans-serif';
      ctx.fillText('🦖', 50, state.dinoY + 30);

      // Obstacles
      ctx.font = '32px sans-serif';
      state.obstacles.forEach((obs) => {
        ctx.fillText(obs.emoji, obs.x, 205);
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [won, onWin, unlockBadge]);

  return (
    <div className={styles.dinoGame}>
      <div className={styles.dinoCard}>
        <div className={styles.gameStats}>
          <span className={styles.statBadge}>⭐ Score: {score}/100</span>
          <span className={styles.statBadge}>🦖 Tap canvas to jump!</span>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={240}
          className={styles.dinoCanvas}
          onClick={jump}
        />

        {gameOver && (
          <div className={styles.winScreen} style={{ padding: '24px' }}>
            <div className={styles.winEmoji}>💥</div>
            <h2 className={styles.winTitle} style={{ color: '#EF4444' }}>Ouch!</h2>
            <p className={styles.winMoves}>Dino bumped an obstacle! Scored {score} points.</p>
            <button className={styles.playAgainBtn} onClick={resetGame}>
              Try Again 🔄
            </button>
          </div>
        )}

        <button className={styles.checkBtn} onClick={jump}>
          Jump! ⬆️
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 9. Fruit Catcher Game (Nutritious Arcade Reflex)
// ============================================================
const FRUITS = ['🍎', '🍌', '🍓', '🍊', '🍇', '🍉', '🍍'];

interface FallingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  isHazard: boolean;
}

function FruitCatcher({ onWin }: { onWin: () => void }) {
  const [basketX, setBasketX] = useState(260);
  const [caught, setCaught] = useState(0);
  const [won, setWon] = useState(false);
  const { unlockBadge } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const itemsRef = useRef<FallingItem[]>([]);
  const nextItemId = useRef(1);

  const moveLeft = () => setBasketX((x) => Math.max(x - 40, 20));
  const moveRight = () => setBasketX((x) => Math.min(x + 40, 520));

  const restart = () => {
    itemsRef.current = [];
    setCaught(0);
    setWon(false);
  };

  useEffect(() => {
    if (won) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let spawnCount = 0;

    const loop = () => {
      spawnCount++;
      if (spawnCount > 45) {
        spawnCount = 0;
        const isHazard = Math.random() < 0.2;
        itemsRef.current.push({
          id: nextItemId.current++,
          emoji: isHazard ? '⚡' : FRUITS[Math.floor(Math.random() * FRUITS.length)],
          x: Math.floor(Math.random() * 520) + 30,
          y: -20,
          speed: Math.random() * 2 + 2.5,
          isHazard,
        });
      }

      // Update positions
      itemsRef.current.forEach((it) => {
        it.y += it.speed;
      });

      // Catch check
      itemsRef.current = itemsRef.current.filter((it) => {
        if (it.y > 270 && it.y < 315 && Math.abs(it.x - basketX) < 45) {
          if (it.isHazard) {
            sound.playWrong();
          } else {
            sound.playPop();
            setCaught((c) => {
              const next = c + 1;
              if (next >= 10 && !won) {
                sound.playWin();
                unlockBadge('fruit_champ');
                onWin();
                setWon(true);
              }
              return next;
            });
          }
          return false;
        }
        return it.y < 340;
      });

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Basket
      ctx.font = '46px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧺', basketX, 305);

      // Items
      ctx.font = '32px sans-serif';
      itemsRef.current.forEach((it) => {
        ctx.fillText(it.emoji, it.x, it.y);
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [basketX, won, onWin, unlockBadge]);

  return (
    <div className={styles.fruitGame}>
      <div className={styles.fruitCard}>
        <div className={styles.gameStats}>
          <span className={styles.statBadge}>⭐ Fresh Fruits: {caught}/10</span>
          <span className={styles.statBadge}>🧺 Catch fruits, dodge thunder!</span>
        </div>

        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          className={styles.fruitCanvas}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setBasketX(Math.max(30, Math.min(540, e.clientX - rect.left)));
          }}
        />

        {won ? (
          <div className={styles.winScreen}>
            <div className={styles.winEmoji}>🍓 🏆</div>
            <h2 className={styles.winTitle}>Fruit Champion!</h2>
            <p className={styles.winMoves}>You caught 10 fresh delicious fruits!</p>
            <button className={styles.playAgainBtn} onClick={restart}>
              Play Again 🔄
            </button>
          </div>
        ) : (
          <div className={styles.catcherControls}>
            <button className={styles.catcherBtn} onClick={moveLeft}>
              ⬅️ Left
            </button>
            <button className={styles.catcherBtn} onClick={moveRight}>
              Right ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Game Router
// ============================================================
const GAME_COMPONENTS: Record<string, React.ComponentType<{ onWin: () => void }>> = {
  'memory-match':  MemoryGame,
  'math-quiz':     MathQuiz,
  'spelling-bee':  SpellingBee,
  'coloring-book': ColoringBook,
  'animal-puzzle': AnimalPuzzle,
  'balloon-pop':   BalloonPop,
  'magic-piano':   MagicPiano,
  'dino-runner':   DinoRunner,
  'fruit-catcher': FruitCatcher,
};

function GameContent({ slug }: { slug: string }) {
  const game = GAMES.find((g) => g.slug === slug);
  const { addStars } = useApp();
  const [won, setWon] = useState(false);

  const handleWin = () => {
    setWon(true);
    addStars(10);
  };

  if (!game) return (
    <div className={styles.error}>
      <span>🎮</span>
      <h2>Game not found</h2>
      <Link href="/games">Back to Games</Link>
    </div>
  );

  const GameComponent = GAME_COMPONENTS[slug];

  return (
    <div className={styles.page}>
      <ChildHeader />
      <main>
        <div className={styles.container}>
          <Link href="/games" className={styles.back}>← Back to Games</Link>

          <div className={styles.gameHeader} style={{ background: game.bgGradient }}>
            <span className={styles.gameHeaderEmoji}>{game.emoji}</span>
            <h1 className={styles.gameHeaderTitle}>{game.title}</h1>
            <p className={styles.gameHeaderDesc}>{game.description}</p>
          </div>

          {won && (
            <div className={styles.winBanner}>
              🏆 Amazing! You earned <strong>+10 stars!</strong> 🌟
            </div>
          )}

          {GameComponent ? (
            <GameComponent onWin={handleWin} />
          ) : (
            <div className={styles.comingSoon}>
              <span>🚀</span>
              <h2>Coming Soon!</h2>
              <p>This game is being built. Check back soon!</p>
              <Link href="/games" className={styles.backBtn}>Other Games</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <GameContent slug={slug} />;
}
