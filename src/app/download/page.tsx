'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function DownloadPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading KidoTube App...</div>}>
      <DownloadContent />
    </Suspense>
  );
}

function DownloadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get('code') || '';

  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [activeTab, setActiveTab] = useState<'parent' | 'child'>('parent');

  // Parent pairing state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeExpiry, setCodeExpiry] = useState<number | null>(null);
  const [parentGenerating, setParentGenerating] = useState(false);

  // Child pairing state
  const [inputCode, setInputCode] = useState<string>(initialCode);
  const [childConnecting, setChildConnecting] = useState(false);
  const [pairError, setPairError] = useState<string | null>(null);
  const [pairSuccess, setPairSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Detect device
    const ua = navigator.userAgent.toLowerCase();
    if (/android/i.test(ua)) {
      setDeviceType('android');
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }

    // Listen for PWA install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('To install on iOS: Tap Share ⎙ and select "Add to Home Screen". On Chrome Desktop: Click the install icon in the address bar.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleGeneratePairCode = async () => {
    setParentGenerating(true);
    try {
      const res = await fetch('/api/parent/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: 'parent_demo_01' }),
      });
      const data = await res.json();
      const code = data.pairingCode || data.session?.code;
      if (data.success && code) {
        setGeneratedCode(code);
        setCodeExpiry(data.expiresAt || data.session?.expiresAt || Date.now() + 15 * 60 * 1000);
      } else {
        alert(data.error || 'Failed to generate pairing code.');
      }
    } catch (err) {
      alert('Network error while generating code.');
    } finally {
      setParentGenerating(false);
    }
  };

  const handleConnectChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setPairError(null);
    setPairSuccess(null);

    if (!inputCode.trim()) {
      setPairError('Please enter a 6-digit family pairing code.');
      return;
    }

    setChildConnecting(true);
    try {
      const res = await fetch('/api/child/verify-pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPairSuccess(`🎉 Successfully paired with ${data.settings?.nickname || 'your family'}!`);
        // Store in localStorage for child mode synchronization
        localStorage.setItem('kidotube_device_token', data.deviceToken);
        localStorage.setItem('kidotube_parent_id', data.parentId);
        localStorage.setItem('kidotube_child_profile', JSON.stringify(data.settings));
        localStorage.setItem('kidotube_mode', 'child');

        // Redirect to homepage in safe child mode after 1.5s
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setPairError(data.error || 'Invalid or expired code. Please verify and try again.');
      }
    } catch (err) {
      setPairError('Failed to connect. Please check your internet connection.');
    } finally {
      setChildConnecting(false);
    }
  };

  return (
    <div className={styles.downloadPage}>
      <header className={styles.topNav}>
        <Link href="/" className={styles.brandLink}>
          <span>🌟</span>
          <span>KidoTube Safe</span>
        </Link>
        <Link href="/" className={styles.backBtn}>
          ← Back to Kids Hub
        </Link>
      </header>

      <main>
        <section className={styles.heroSection}>
          <div className={styles.badge}>📱 KidoTube Everywhere</div>
          <h1 className={styles.title}>Install KidoTube on Any Device</h1>
          <p className={styles.subtitle}>
            Safe, ad-free learning and fun for kids aged 6–10. Parents control time limits and approved content; kids explore freely in safe child mode.
          </p>

          <div className={styles.deviceBanner}>
            <span>Detected Device:</span>
            <strong>
              {deviceType === 'android' ? '🤖 Android Phone / Tablet' : deviceType === 'ios' ? '🍏 iPhone / iPad' : '💻 Desktop / Laptop'}
            </strong>
          </div>

          <div className={styles.primaryActions}>
            {deviceType === 'android' && (
              <a href="/downloads/kidotube-debug.apk" download className={styles.primaryBtn}>
                <span>🤖</span>
                <span>Download Android APK (Direct)</span>
              </a>
            )}

            <button onClick={handleInstallPWA} className={styles.primaryBtn}>
              <span>⚡</span>
              <span>{isInstallable ? 'Install App on This Device' : 'Add Web App to Home Screen'}</span>
            </button>

            <button
              onClick={() => setActiveTab('parent')}
              className={styles.secondaryBtn}
            >
              <span>🔑</span>
              <span>Pair a Child's Device</span>
            </button>
          </div>
        </section>

        {/* Store Cards */}
        <section className={styles.storeGrid}>
          <div className={styles.storeCard}>
            <span className={styles.storeTag}>Pre-Release</span>
            <div className={styles.storeIcon}>🤖</div>
            <h2 className={styles.storeTitle}>Google Play Store</h2>
            <p className={styles.storeDesc}>
              Designed for Android tablets and phones with native screen-time lock and background reminder alarms.
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.kidotube.safe"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              style={{ width: '100%' }}
            >
              Google Play (Coming Soon)
            </a>
          </div>

          <div className={styles.storeCard}>
            <span className={styles.storeTag}>Pre-Release</span>
            <div className={styles.storeIcon}>🍏</div>
            <h2 className={styles.storeTitle}>Apple App Store</h2>
            <p className={styles.storeDesc}>
              Built for iPad and iPhone under Apple Kids Category (Ages 6–8 & 9–11) with zero third-party tracking.
            </p>
            <a
              href="https://apps.apple.com/app/kidotube-safe-learning/id6400000000"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              style={{ width: '100%' }}
            >
              App Store (Coming Soon)
            </a>
          </div>

          <div className={styles.storeCard}>
            <span className={styles.storeTag} style={{ background: '#ecfdf5', color: '#047857' }}>Ready Now</span>
            <div className={styles.storeIcon}>📦</div>
            <h2 className={styles.storeTitle}>Android APK (Direct)</h2>
            <p className={styles.storeDesc}>
              Instant installation for family testing and side-loading on Amazon Fire tablets and Android devices.
            </p>
            <a
              href="/downloads/kidotube-debug.apk"
              download
              className={styles.primaryBtn}
              style={{ width: '100%' }}
            >
              Download APK (.apk)
            </a>
          </div>
        </section>

        {/* Multi-Device Pairing Section */}
        <section className={styles.pairingSection}>
          <div className={styles.pairingCard}>
            <div className={styles.tabHeader}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'parent' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('parent')}
              >
                <span>👨‍👩‍👧</span>
                <span>Parents: Connect Child Device</span>
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'child' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('child')}
              >
                <span>🧒</span>
                <span>Child: Enter Family Code</span>
              </button>
            </div>

            {activeTab === 'parent' ? (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
                  Generate a Child Device Pairing Code
                </h3>
                <p style={{ color: '#64748b', marginBottom: 20 }}>
                  Enter this 6-digit code on your child’s tablet or phone to link it to your parent dashboard.
                  Your screen-time limits and study reminders will sync automatically.
                </p>

                {generatedCode ? (
                  <div className={styles.codeBox}>
                    <p style={{ fontWeight: 600, color: '#334155' }}>Your Child Pairing Code is:</p>
                    <div className={styles.codeDisplay}>{generatedCode}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Valid for 15 minutes. Enter this code at <strong>kidotube.com/download</strong> on child’s device.
                    </p>
                    <button
                      onClick={handleGeneratePairCode}
                      className={styles.secondaryBtn}
                      style={{ marginTop: 16 }}
                    >
                      Generate New Code 🔄
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <button
                      onClick={handleGeneratePairCode}
                      disabled={parentGenerating}
                      className={styles.primaryBtn}
                    >
                      {parentGenerating ? 'Generating Code...' : '🔑 Generate 6-Digit Family Code'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
                  Pair This Device to Your Family
                </h3>
                <p style={{ color: '#64748b', marginBottom: 20 }}>
                  Ask your parent for the 6-digit pairing code from their dashboard, then type it below.
                </p>

                <form onSubmit={handleConnectChild}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      className={styles.pairInput}
                      placeholder="e.g. KIDO-4821"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      maxLength={12}
                    />
                    <button
                      type="submit"
                      disabled={childConnecting}
                      className={styles.primaryBtn}
                      style={{ width: '100%' }}
                    >
                      {childConnecting ? 'Connecting...' : '🚀 Connect & Start Safe Child Mode'}
                    </button>
                  </div>
                </form>

                {pairSuccess && <div className={styles.successBox}>{pairSuccess}</div>}
                {pairError && <div className={styles.errorBox}>{pairError}</div>}
              </div>
            )}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h4><span>🛡️</span> Zero Ads & Zero Trackers</h4>
            <p>100% compliant with COPPA and GDPR-K. No tracking, no marketing, and no open web links.</p>
          </div>
          <div className={styles.featureCard}>
            <h4><span>⏰</span> Parent Remote Control</h4>
            <p>Adjust daily screen-time limits, set study reminder alarms, or block categories from your phone.</p>
          </div>
          <div className={styles.featureCard}>
            <h4><span>🎨</span> Private Creative Studio</h4>
            <p>Drawing pad and letter tracing with step-by-step drawing guides saved safely on device.</p>
          </div>
          <div className={styles.featureCard}>
            <h4><span>📶</span> Offline Learning Ready</h4>
            <p>Notebook, tracing, and educational mini-games work even on road trips with no Wi-Fi.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
