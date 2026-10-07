import React, { useState } from 'react';

interface ApiKeyModalProps {
  onApiKeySubmit: (apiKey: string) => void;
  error?: string | null;
  isLoading: boolean;
}

export function ApiKeyModal({ onApiKeySubmit, error, isLoading }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() && !isLoading) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Gemini API Key Required</h2>
        <p style={styles.description}>
          Please provide your Gemini API key to enable real-time transcription and AI-powered architecture suggestions. Your key is only used for this session and is not stored.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            style={styles.input}
            disabled={isLoading}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
        <p style={styles.footer}>
          You can find your API key on the{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Google AI Studio website
          </a>.
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(35, 22, 73, 0.28)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    background: 'rgba(255, 255, 255, 0.94)',
    padding: '2.25rem',
    border: '1px solid rgba(129, 93, 205, 0.18)',
    borderRadius: '24px',
    boxShadow: '0 24px 70px rgba(74, 43, 161, 0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#171b2d',
  },
  description: {
    margin: '0 0 1.5rem',
    fontSize: '0.9rem',
    color: '#667085',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid rgba(129, 93, 205, 0.24)',
    borderRadius: '12px',
    boxSizing: 'border-box',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'white',
    background: 'linear-gradient(135deg, #4a2ba1, #7c3aed)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    color: '#b04476',
    fontSize: '0.875rem',
    marginTop: '-0.5rem',
    marginBottom: '1rem',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: '#667085',
  },
  link: {
    color: '#6437c7',
    textDecoration: 'none',
  },
};
