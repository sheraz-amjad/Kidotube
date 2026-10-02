'use client';

import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #eff6ff 0%, #fdf2f8 100%)',
      fontFamily: 'inherit',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📶 🎈</div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
        You are in Offline Adventure Mode!
      </h1>
      <p style={{ maxWidth: '520px', color: '#64748b', fontSize: '1.1rem', marginBottom: '28px', lineHeight: 1.6 }}>
        No Wi-Fi? No problem! You can still practice drawing and letter tracing in your Notebook, or play saved mini-games!
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/notebook"
          style={{
            padding: '14px 24px',
            borderRadius: '14px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
          }}
        >
          <span>🎨</span>
          <span>Open My Notebook</span>
        </Link>

        <Link
          href="/games"
          style={{
            padding: '14px 24px',
            borderRadius: '14px',
            background: '#ffffff',
            color: '#1e293b',
            border: '2px solid #cbd5e1',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🎮</span>
          <span>Play Mini Games</span>
        </Link>
      </div>
    </div>
  );
}
