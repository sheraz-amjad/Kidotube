'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ChildHeader from '@/components/ChildHeader';
import { useApp } from '@/lib/context';
import { sound } from '@/lib/sound';
import styles from './page.module.css';

const ENGLISH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const URDU_ALPHABET = [
  'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ',
  'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل',
  'م', 'ن', 'و', 'ہ', 'ء', 'ی', 'ے'
];
const HINDI_ALPHABET = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ',
  'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब',
  'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'
];

const DRAW_TEMPLATES = [
  { id: 'cat',       name: 'Kitten 🐱', steps: ['Head Circle', 'Triangle Ears', 'Cute Whiskers & Eyes', 'Smiling Mouth'] },
  { id: 'rocket',    name: 'Rocket 🚀', steps: ['Rocket Body', 'Glass Window', 'Side Fins', 'Fire Thrusters'] },
  { id: 'house',     name: 'Cozy House 🏠', steps: ['Square Walls', 'Triangle Roof', 'Front Door', 'Sunny Window'] },
  { id: 'butterfly', name: 'Butterfly 🦋', steps: ['Oval Body', 'Big Wings', 'Wing Patterns', 'Curly Antennae'] },
  { id: 'tree',      name: 'Oak Tree 🌳', steps: ['Sturdy Trunk', 'Bushy Leaves', 'Apples', 'Green Grass'] },
];

const PALETTE = [
  '#1E293B', '#FF6B6B', '#FF6B9D', '#9333EA',
  '#3B82F6', '#06B6D4', '#10B981', '#F59E0B',
  '#F97316', '#78350F', '#FFFFFF'
];

export default function NotebookPage() {
  const {
    saveNotebookEntry,
    notebookEntries,
    deleteNotebookEntry,
    submitToKidsCorner,
    allowKidsCorner,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tracing' | 'draw_along' | 'notes' | 'gallery'>('tracing');
  const [lang, setLang] = useState<'english' | 'urdu' | 'hindi'>('english');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedTemplate, setSelectedTemplate] = useState(DRAW_TEMPLATES[0]);
  const [drawStep, setDrawStep] = useState(1);

  const [color, setColor] = useState('#1E293B');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('My Practice Sheet');
  const [shareMsg, setShareMsg] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Canvas Background & Tracing Guidelines
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill clean page background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (activeTab === 'tracing') {
      // Draw 4-line notebook guidelines
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      [100, 160, 220, 280].forEach((y, i) => {
        ctx.beginPath();
        if (i === 1 || i === 2) ctx.setLineDash([6, 6]);
        else ctx.setLineDash([]);
        ctx.moveTo(30, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw faint dotted tracing letter
      ctx.font =
        lang === 'urdu'
          ? '180px sans-serif'
          : lang === 'hindi'
          ? 'bold 150px "Outfit", sans-serif'
          : 'bold 160px "Fredoka One", cursive';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedLetter, cx, cy + 10);
    } else if (activeTab === 'draw_along') {
      // Step-by-step drawing guidance
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);

      if (selectedTemplate.id === 'cat') {
        // Step 1: Head
        ctx.beginPath();
        ctx.arc(cx, cy, 70, 0, Math.PI * 2);
        ctx.stroke();

        if (drawStep >= 2) {
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
        }
        if (drawStep >= 3) {
          // Eyes & Nose
          ctx.beginPath();
          ctx.arc(cx - 25, cy - 10, 8, 0, Math.PI * 2);
          ctx.arc(cx + 25, cy - 10, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (selectedTemplate.id === 'house') {
        // Walls
        ctx.strokeRect(cx - 90, cy - 30, 180, 130);
        if (drawStep >= 2) {
          // Roof
          ctx.beginPath();
          ctx.moveTo(cx - 110, cy - 30);
          ctx.lineTo(cx, cy - 120);
          ctx.lineTo(cx + 110, cy - 30);
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    } else if (activeTab === 'notes') {
      // Lined notebook grid
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 2;
      for (let y = 60; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
      }
    }
  }, [activeTab, lang, selectedLetter, selectedTemplate, drawStep]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Coordinate scaling
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  // Pronounce letter/word with Text-to-Speech
  const pronounceLetter = () => {
    sound.playPop();
    if (lang === 'urdu') {
      sound.speak(`حرف ${selectedLetter}`);
    } else if (lang === 'hindi') {
      sound.speak(`अक्षर ${selectedLetter}`);
    } else {
      sound.speak(`Letter ${selectedLetter}`);
    }
  };

  // Save to private keepsake gallery
  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const title =
      activeTab === 'tracing'
        ? `${lang === 'urdu' ? 'Urdu' : lang === 'hindi' ? 'Hindi' : 'English'} Tracing: ${selectedLetter}`
        : activeTab === 'draw_along'
        ? `Draw Along: ${selectedTemplate.name}`
        : noteTitle;

    saveNotebookEntry({
      type: activeTab as 'tracing' | 'draw_along' | 'notes',
      title,
      previewUrl: dataUrl,
      language: lang,
    });
    setShareMsg('⭐ Saved to your Private Gallery! Earned +5 stars!');
    setTimeout(() => setShareMsg(''), 3000);
  };

  // Share to Safe Kids Corner (Community)
  const handleShareToCorner = () => {
    if (!allowKidsCorner) {
      setShareMsg('🛡️ Parent permission is required in Parent Dashboard to share creations.');
      sound.playWrong();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const title =
      activeTab === 'tracing'
        ? `Letter Tracing: ${selectedLetter}`
        : `${selectedTemplate.name} Artwork`;

    const ok = submitToKidsCorner(title, dataUrl, activeTab === 'tracing' ? 'Writing' : 'Art');
    if (ok) {
      setShareMsg('🚀 Sent to Safe Kids Corner for moderation approval!');
      setTimeout(() => setShareMsg(''), 3500);
    }
  };

  // Export as Printable PDF Keepsake
  const handlePrintKeepsake = () => {
    sound.playStar();
    window.print();
  };

  return (
    <div className={styles.page}>
      <ChildHeader />

      <main>
        <div className={styles.container}>
          {/* Header Banner */}
          <div className={styles.headerBanner}>
            <h1 className={styles.bannerTitle}>📓 My Notebook</h1>
            <p className={styles.bannerSub}>
              Practice handwriting, follow step-by-step drawing templates, and build your private keepsake portfolio!
            </p>
          </div>

          {/* Tab Navigation */}
          <div className={styles.tabRow}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'tracing' ? styles.tabActive : ''}`}
              onClick={() => {
                sound.playPop();
                setActiveTab('tracing');
              }}
            >
              ✍️ Letter Tracing
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'draw_along' ? styles.tabActive : ''}`}
              onClick={() => {
                sound.playPop();
                setActiveTab('draw_along');
              }}
            >
              🎨 Draw Along
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabActive : ''}`}
              onClick={() => {
                sound.playPop();
                setActiveTab('notes');
              }}
            >
              📝 Learning Notes
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.tabActive : ''}`}
              onClick={() => {
                sound.playPop();
                setActiveTab('gallery');
              }}
            >
              🖼️ Keepsake Gallery ({notebookEntries.length})
            </button>
          </div>

          {shareMsg && (
            <div
              style={{
                background: '#FEF08A',
                color: '#713F12',
                padding: '12px 20px',
                borderRadius: '16px',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '16px',
                border: '2px solid #FACC15',
              }}
            >
              {shareMsg}
            </div>
          )}

          {/* Tab 1, 2, 3: Interactive Workspace */}
          {activeTab !== 'gallery' ? (
            <div className={styles.workspace}>
              {/* Tracing Sub-Selector */}
              {activeTab === 'tracing' && (
                <>
                  <div className={styles.subSelector}>
                    <span className={styles.subLabel}>Language:</span>
                    <button
                      className={`${styles.subBtn} ${lang === 'english' ? styles.subBtnActive : ''}`}
                      onClick={() => {
                        setLang('english');
                        setSelectedLetter('A');
                      }}
                    >
                      🇬🇧 English (A–Z)
                    </button>
                    <button
                      className={`${styles.subBtn} ${lang === 'urdu' ? styles.subBtnActive : ''}`}
                      onClick={() => {
                        setLang('urdu');
                        setSelectedLetter('ا');
                      }}
                    >
                      🇵🇰 Urdu (حروف تہجی)
                    </button>
                    <button
                      className={`${styles.subBtn} ${lang === 'hindi' ? styles.subBtnActive : ''}`}
                      onClick={() => {
                        setLang('hindi');
                        setSelectedLetter('अ');
                      }}
                    >
                      🇮🇳 Hindi (वर्णमाला)
                    </button>

                    <button
                      className={styles.subBtn}
                      onClick={pronounceLetter}
                      title="Listen to pronunciation"
                    >
                      🗣️ Pronounce
                    </button>
                  </div>

                  {/* Letter carousel */}
                  <div className={styles.lettersScroll}>
                    {(lang === 'english' ? ENGLISH_ALPHABET : lang === 'urdu' ? URDU_ALPHABET : HINDI_ALPHABET).map((ltr) => (
                      <button
                        key={ltr}
                        className={`${styles.letterChip} ${selectedLetter === ltr ? styles.letterChipActive : ''}`}
                        onClick={() => {
                          sound.playPop();
                          setSelectedLetter(ltr);
                        }}
                      >
                        {ltr}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Draw Along Sub-Selector */}
              {activeTab === 'draw_along' && (
                <div className={styles.subSelector}>
                  <span className={styles.subLabel}>Template:</span>
                  {DRAW_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      className={`${styles.subBtn} ${selectedTemplate.id === tpl.id ? styles.subBtnActive : ''}`}
                      onClick={() => {
                        sound.playPop();
                        setSelectedTemplate(tpl);
                        setDrawStep(1);
                      }}
                    >
                      {tpl.name}
                    </button>
                  ))}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '12px' }}>
                    <span className={styles.subLabel}>Step:</span>
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        className={`${styles.subBtn} ${drawStep === s ? styles.subBtnActive : ''}`}
                        onClick={() => {
                          sound.playPop();
                          setDrawStep(s);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Title Input */}
              {activeTab === 'notes' && (
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Sheet Title (e.g. Science Vocabulary)"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '99px',
                    border: '2px solid var(--border)',
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'center',
                    maxWidth: '360px',
                    width: '100%',
                  }}
                />
              )}

              {/* Canvas Pad */}
              <div className={styles.canvasWrapper}>
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={380}
                  className={styles.padCanvas}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
              </div>

              {/* Tools Controls Bar */}
              <div className={styles.controlsBar}>
                {/* Colors */}
                <div className={styles.paletteRow}>
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      className={`${styles.colorSwatch} ${color === c ? styles.swatchActive : ''}`}
                      style={{ background: c }}
                      onClick={() => {
                        sound.playPop();
                        setColor(c);
                      }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>

                {/* Brush size */}
                <div className={styles.brushRow}>
                  <span className={styles.subLabel}>Pen Size:</span>
                  {[
                    { s: 4, l: 'Fine' },
                    { s: 8, l: 'Medium' },
                    { s: 16, l: 'Thick' },
                    { s: 30, l: 'Marker' },
                  ].map((b) => (
                    <button
                      key={b.s}
                      className={`${styles.sizeBtn} ${brushSize === b.s ? styles.sizeActive : ''}`}
                      onClick={() => {
                        sound.playPop();
                        setBrushSize(b.s);
                      }}
                    >
                      {b.l}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className={styles.actionRow}>
                  <button className={styles.actionBtn} onClick={redrawCanvas}>
                    🗑️ Clear
                  </button>
                  <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleSaveToGallery}>
                    💾 Save to Private Gallery
                  </button>
                  <button className={`${styles.actionBtn} ${styles.shareBtn}`} onClick={handleShareToCorner}>
                    🎨 Share to Safe Kids Corner
                  </button>
                  <button className={`${styles.actionBtn} ${styles.printBtn}`} onClick={handlePrintKeepsake}>
                    🖨️ Export PDF Keepsake
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 4: Private Keepsake Gallery */
            <div className={styles.workspace}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'Fredoka One', fontSize: '24px' }}>
                  📁 My Private Keepsake Gallery
                </h2>
                {notebookEntries.length > 0 && (
                  <button className={`${styles.actionBtn} ${styles.printBtn}`} onClick={handlePrintKeepsake}>
                    🖨️ Print All as Keepsake PDF
                  </button>
                )}
              </div>

              {notebookEntries.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyEmoji}>📓</span>
                  <h3 style={{ fontFamily: 'Fredoka One', fontSize: '20px', marginBottom: '8px' }}>
                    Your gallery is empty!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Practice handwriting or trace letters and click &quot;Save to Private Gallery&quot;!
                  </p>
                </div>
              ) : (
                <div className={styles.galleryGrid}>
                  {notebookEntries.map((item) => (
                    <div key={item.id} className={styles.galleryCard}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.previewUrl} alt={item.title} className={styles.galleryThumb} />
                      <div className={styles.galleryInfo}>
                        <h4 className={styles.galleryTitle}>{item.title}</h4>
                        <span className={styles.galleryDate}>📅 {item.date}</span>
                        <div className={styles.galleryActions}>
                          <button
                            className={styles.delBtn}
                            onClick={() => deleteNotebookEntry(item.id)}
                          >
                            Delete
                          </button>
                          <a
                            href={item.previewUrl}
                            download={`notebook-${item.id}.png`}
                            className={styles.subBtn}
                            style={{ fontSize: '11px', textDecoration: 'none' }}
                          >
                            Download PNG 💾
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
