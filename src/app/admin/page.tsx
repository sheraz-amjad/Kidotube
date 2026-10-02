'use client';

import { useApp } from '@/lib/context';
import { useState } from 'react';
import Link from 'next/link';
import { GAMES, CATEGORIES, getTotalStats, getAllVideos, ContentCategory, AgeGroup, Video } from '@/lib/data';
import { sound } from '@/lib/sound';
import styles from './page.module.css';

// ============================================================
// Admin Login
// ============================================================
function AdminLogin() {
  const { unlockAdmin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = unlockAdmin(username, password);
    if (!ok) setError('❌ Invalid credentials. Try admin / kidotube2024');
    setLoading(false);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>🛠️</div>
        <h1 className={styles.loginTitle}>Admin Panel</h1>
        <p className={styles.loginSub}>KidoTube Content Management</p>
        <p className={styles.loginHint}>Demo: admin / kidotube2024</p>

        {error && <div className={styles.loginError}>{error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            placeholder="admin"
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
        </div>

        <button className={styles.loginBtn} onClick={login} disabled={loading}>
          {loading ? '🔄 Logging in...' : '🔐 Sign In'}
        </button>

        <Link href="/" className={styles.backLink}>← Back to Child Portal</Link>
      </div>
    </div>
  );
}

// ============================================================
// Admin Dashboard
// ============================================================
type Tab = 'overview' | 'videos' | 'games' | 'moderation' | 'analytics';

function AdminDashboard() {
  const { lockAdmin, customVideos } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const stats = getTotalStats(customVideos);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview',    label: 'Overview',              icon: '📊' },
    { id: 'videos',      label: 'Videos',                icon: '🎬' },
    { id: 'games',       label: 'Games',                 icon: '🎮' },
    { id: 'moderation',  label: 'Kids Corner Moderation', icon: '🛡️' },
    { id: 'analytics',   label: 'Analytics',             icon: '📈' },
  ];

  return (
    <div className={styles.admin}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span>🎬</span>
          <span className={styles.sidebarLogoText}>KidoTube</span>
          <span className={styles.sidebarAdmin}>ADMIN</span>
        </div>

        <nav className={styles.nav}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.navItem} ${activeTab === t.id ? styles.navActive : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.viewSite}>🌐 View Child Portal</Link>
          <button className={styles.logoutBtn} onClick={lockAdmin}>🚪 Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {activeTab === 'overview'   && <OverviewTab stats={stats} />}
        {activeTab === 'videos'     && <VideosTab />}
        {activeTab === 'games'      && <GamesTab />}
        {activeTab === 'moderation' && <ModerationTab />}
        {activeTab === 'analytics'  && <AnalyticsTab />}
      </main>
    </div>
  );
}

// ============================================================
// Overview Tab
// ============================================================
function OverviewTab({ stats }: { stats: ReturnType<typeof getTotalStats> }) {
  const { customVideos } = useApp();
  const allVids = getAllVideos(customVideos);

  const cards = [
    { label: 'Total Videos',    value: stats.totalVideos,    icon: '🎬', color: '#6C63FF' },
    { label: 'Total Games',     value: stats.totalGames,     icon: '🎮', color: '#FF6B9D' },
    { label: 'Total Views',     value: stats.totalViews.toLocaleString(), icon: '👁',  color: '#6BCB77' },
    { label: 'Total Reports',   value: stats.totalReports,   icon: '🚨', color: '#FF9F43' },
    { label: 'Custom Added',    value: customVideos.length,  icon: '✨', color: '#4ECDC4' },
    { label: 'Categories',      value: CATEGORIES.length,    icon: '📂', color: '#FFD93D' },
  ];

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>📊 Platform Overview</h2>

      <div className={styles.overviewGrid}>
        {cards.map((c) => (
          <div key={c.label} className={styles.overviewCard} style={{ borderLeftColor: c.color }}>
            <span className={styles.overviewIcon}>{c.icon}</span>
            <div>
              <p className={styles.overviewValue} style={{ color: c.color }}>{c.value}</p>
              <p className={styles.overviewLabel}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentSection}>
        <h3 className={styles.sectionTitle}>🔥 Top 5 Most Watched Videos</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Title</span>
            <span>Category</span>
            <span>Views</span>
            <span>Status</span>
          </div>
          {[...allVids].sort((a,b) => b.views - a.views).slice(0, 5).map((v) => (
            <div key={v.id} className={styles.tableRow}>
              <span className={styles.tableCellBold}>{v.title}</span>
              <span className={styles.catPill}>{v.category}</span>
              <span>{v.views.toLocaleString()}</span>
              <span className={v.approved ? styles.statusLive : styles.statusPending}>
                {v.approved ? '🟢 Live' : '⏳ Review'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Videos Tab
// ============================================================
function VideosTab() {
  const { customVideos, addCustomVideo } = useApp();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding video
  const [newTitle, setNewTitle] = useState('');
  const [newYtId, setNewYtId] = useState('');
  const [newCat, setNewCat] = useState<ContentCategory>('cartoons');
  const [newAge, setNewAge] = useState<AgeGroup>('all');
  const [newLang, setNewLang] = useState<'english' | 'urdu' | 'both'>('english');
  const [newDuration, setNewDuration] = useState('8');
  const [newDesc, setNewDesc] = useState('');

  const allVids = getAllVideos(customVideos);

  const filtered = allVids.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || v.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newYtId.trim()) return;

    // Clean YouTube ID if pasted full URL
    let ytId = newYtId.trim();
    if (ytId.includes('v=')) {
      ytId = ytId.split('v=')[1]?.split('&')[0] || ytId;
    } else if (ytId.includes('youtu.be/')) {
      ytId = ytId.split('youtu.be/')[1]?.split('?')[0] || ytId;
    }

    const newVideo: Video = {
      id: `v_custom_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Exciting video for kids!',
      youtubeId: ytId,
      thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      category: newCat,
      ageGroup: newAge,
      durationMinutes: parseInt(newDuration) || 5,
      language: newLang,
      tags: [newCat, 'custom', newLang],
      approved: true,
      addedAt: new Date().toISOString().split('T')[0],
      views: 1,
      reports: 0,
    };

    addCustomVideo(newVideo);
    sound.playWin();
    setShowAddModal(false);

    // Reset form
    setNewTitle('');
    setNewYtId('');
    setNewDesc('');
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabTitleRow}>
        <h2 className={styles.tabTitle}>🎬 Video Library ({allVids.length})</h2>
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          + Add New Video
        </button>
      </div>

      <div className={styles.filters}>
        <input
          id="video-search"
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Search videos by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          id="video-category-filter"
          className={styles.select}
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Title</span>
          <span>Category</span>
          <span>Age Group</span>
          <span>Duration</span>
          <span>Views</span>
          <span>Status</span>
        </div>
        {filtered.map((v) => (
          <div key={v.id} className={styles.tableRow}>
            <span className={styles.tableCellBold}>{v.title}</span>
            <span className={styles.catPill}>{v.category}</span>
            <span>{v.ageGroup}</span>
            <span>{v.durationMinutes}m</span>
            <span>{v.views.toLocaleString()}</span>
            <span className={v.approved ? styles.statusLive : styles.statusPending}>
              {v.approved ? '🟢 Live' : '⏳ Review'}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.tableEmpty}>No videos matched your filter.</div>
        )}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>✨ Add Video to KidoTube</h3>
            <form onSubmit={handleCreateVideo} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheels on the Bus Rhyme"
                  className={styles.input}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>YouTube ID or Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WfPOs1ZDqpM or https://youtube.com/watch?v=..."
                  className={styles.input}
                  value={newYtId}
                  onChange={(e) => setNewYtId(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Category</label>
                  <select
                    className={styles.input}
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as ContentCategory)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Age Group</label>
                  <select
                    className={styles.input}
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value as AgeGroup)}
                  >
                    <option value="all">All (6–10)</option>
                    <option value="6-7">Ages 6–7</option>
                    <option value="8-10">Ages 8–10</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Language</label>
                  <select
                    className={styles.input}
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value as 'english' | 'urdu' | 'both')}
                  >
                    <option value="english">🇬🇧 English</option>
                    <option value="urdu">🇵🇰 Urdu</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className={styles.input}
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Short educational summary"
                  className={styles.input}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Video 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Games Tab
// ============================================================
function GamesTab() {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabTitleRow}>
        <h2 className={styles.tabTitle}>🎮 Games Library ({GAMES.length})</h2>
      </div>
      <div className={styles.gamesGrid}>
        {GAMES.map((g) => (
          <div key={g.id} className={styles.gameAdminCard}>
            <div className={styles.gameAdminIcon} style={{ background: g.bgGradient }}>
              {g.emoji}
            </div>
            <div className={styles.gameAdminInfo}>
              <p className={styles.gameAdminTitle}>{g.title}</p>
              <p className={styles.gameAdminMeta}>
                Ages {g.ageGroup === 'all' ? '6–10' : g.ageGroup} • {g.category}
              </p>
            </div>
            <div className={styles.gameAdminActions}>
              <span className={styles.statusLive}>🟢 Active</span>
              <Link href={`/games/${g.slug}`} className={styles.actionBtn} target="_blank">
                Play ▶
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Analytics Tab
// ============================================================
function AnalyticsTab() {
  const { customVideos } = useApp();
  const allVids = getAllVideos(customVideos);

  const catStats = CATEGORIES.map((c) => ({
    ...c,
    videos: allVids.filter((v) => v.category === c.id).length,
    views:  allVids.filter((v) => v.category === c.id).reduce((s, v) => s + v.views, 0),
  }));

  const maxViews = Math.max(...catStats.map((c) => c.views)) || 1;

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.tabTitle}>📈 Content Analytics</h2>

      <div className={styles.analyticsGrid}>
        <section className={styles.analyticsPanel}>
          <h3 className={styles.sectionTitle}>Views by Category</h3>
          <div className={styles.chartBars}>
            {catStats.map((c) => (
              <div key={c.id} className={styles.chartRow}>
                <span className={styles.chartLabel}>{c.emoji} {c.label}</span>
                <div className={styles.chartBarWrap}>
                  <div
                    className={styles.chartBar}
                    style={{ width: `${(c.views / maxViews) * 100}%`, background: c.color }}
                  />
                </div>
                <span className={styles.chartValue}>{c.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.analyticsPanel}>
          <h3 className={styles.sectionTitle}>Content Distribution</h3>
          <div className={styles.distTable}>
            {catStats.map((c) => (
              <div key={c.id} className={styles.distRow}>
                <span style={{ color: c.color }} className={styles.distEmoji}>{c.emoji}</span>
                <span className={styles.distLabel}>{c.label}</span>
                <span className={styles.distCount}>{c.videos} videos</span>
                <span className={styles.distViews}>{c.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// Kids Corner Moderation Tab
// ============================================================
function ModerationTab() {
  const { kidsCornerPosts, approveCornerPost, featureCornerPost, deleteCornerPost } = useApp();

  const total = kidsCornerPosts.length;
  const pending = kidsCornerPosts.filter((p) => !p.approved).length;
  const featured = kidsCornerPosts.filter((p) => p.featured).length;

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>🛡️ Kids Corner Moderation Queue</h2>
          <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>
            Pre-moderation queue: All submissions originate strictly from in-app notebooks.
            Scan results, approval status, and weekly features are managed here.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, margin: '16px 0', flexWrap: 'wrap' }}>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 20px', borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Total Submissions</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#1E293B' }}>{total}</div>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '12px 20px', borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: '#92400E', fontWeight: 700 }}>Pending Review</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#B45309' }}>{pending}</div>
        </div>
        <div style={{ background: '#FEF08A', border: '1px solid #FDE047', padding: '12px 20px', borderRadius: 12 }}>
          <span style={{ fontSize: 12, color: '#854D0E', fontWeight: 700 }}>Featured of Week</span>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#A16207' }}>{featured}</div>
        </div>
      </div>

      {kidsCornerPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📭</div>
          <p style={{ fontWeight: 700, color: '#64748B' }}>No submissions in the moderation queue.</p>
        </div>
      ) : (
        <div className={styles.modGrid}>
          {kidsCornerPosts.map((post) => (
            <div key={post.id} className={styles.modCard}>
              <div className={styles.modImageArea}>
                {post.artworkUrl ? (
                  <img src={post.artworkUrl} alt={post.title} className={styles.modImg} />
                ) : (
                  <div style={{ fontSize: 44 }}>
                    {post.category === 'Space' ? '🚀' : post.category === 'Animals' ? '🐘' : '🎨'}
                  </div>
                )}
              </div>

              <div className={styles.modBody}>
                <div className={styles.modHeaderRow}>
                  <span className={styles.modBadgeSafe}>
                    🛡️ AI Scan: {post.aiSafeScanScore}% Safe
                  </span>
                  {post.approved ? (
                    <span className={styles.modBadgeSafe}>✅ Approved</span>
                  ) : (
                    <span className={styles.modBadgePending}>⏳ Pending Review</span>
                  )}
                  {post.featured && (
                    <span className={styles.modBadgeFeatured}>⭐ Featured</span>
                  )}
                </div>

                <div>
                  <h4 style={{ margin: '4px 0 2px', fontSize: 16, fontWeight: 800 }}>{post.title}</h4>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    By <strong>{post.childAvatar} {post.childNickname}</strong> • {post.category} • {post.createdAt}
                  </div>
                </div>

                <div className={styles.modActions}>
                  <button
                    className={styles.modApproveBtn}
                    onClick={() => {
                      approveCornerPost(post.id);
                      sound.playStar();
                    }}
                  >
                    {post.approved ? 'Re-Approve' : '✅ Approve'}
                  </button>
                  <button
                    className={styles.modFeatureBtn}
                    onClick={() => {
                      featureCornerPost(post.id);
                      sound.playStar();
                    }}
                    title="Toggle Featured of the Week"
                  >
                    {post.featured ? 'Unfeature' : '⭐ Feature'}
                  </button>
                  <button
                    className={styles.modDeleteBtn}
                    onClick={() => {
                      deleteCornerPost(post.id);
                      sound.playPop();
                    }}
                    title="Reject and delete submission"
                  >
                    🗑️ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Page Wrapper
// ============================================================
export default function AdminPage() {
  const { isAdminUnlocked } = useApp();
  return isAdminUnlocked ? <AdminDashboard /> : <AdminLogin />;
}
