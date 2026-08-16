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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#111827',
  },
  description: {
    margin: '0 0 1.5rem',
    fontSize: '0.9rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#4a7dff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '-0.5rem',
    marginBottom: '1rem',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  link: {
    color: '#4a7dff',
    textDecoration: 'none',
  },
};
