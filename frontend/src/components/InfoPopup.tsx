import React, { useState } from 'react'

export function InfoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={styles.popup}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        style={styles.trigger}
        aria-expanded={isOpen}
        aria-controls="inspiration-content"
      >
        <span>Need some inspiration?</span>
        <span aria-hidden="true" style={{ fontSize: '18px', lineHeight: 1 }}>
          {isOpen ? '⬆️' : '⬇️'}
        </span>
      </button>

      {isOpen && (
        <div id="inspiration-content" style={styles.content}>
          <p style={styles.description}>Try saying something like:</p>
          <p style={styles.example}>"Draw a database and a server, then connect them with an arrow."</p>
          <hr style={styles.hr} />
          <p style={styles.description}>Here are some items I can draw:</p>
          <ul style={styles.list}>
            <li>Database</li>
            <li>Server</li>
            <li>User</li>
            <li>Frontend</li>
            <li>GPT-5 (LLM)</li>
            <li>GPT Realtime</li>
          </ul>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  popup: {
    position: 'absolute',
    top: '45%',
    right: '20px',
    transform: 'translateY(-0%)',
    zIndex: 1000,
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    width: '280px',
    overflow: 'hidden',
    fontFamily: 'system-ui, sans-serif',
  },
  trigger: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    color: '#111827',
    border: 'none',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
  },
  content: {
    padding: '0 1.5rem 1.5rem',
  },
  description: {
    margin: '0 0 0.5rem',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  example: {
    margin: '0 0 1rem',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: '#374151',
    background: '#f3f4f6',
    padding: '0.5rem',
    borderRadius: '6px',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #e5e7eb',
    margin: '1rem 0',
  },
  list: {
    margin: 0,
    paddingLeft: '1.5rem',
    fontSize: '0.9rem',
    color: '#4b5563',
  },
}
