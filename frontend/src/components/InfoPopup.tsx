import React from 'react'

interface InfoPopupProps {
  isOpen: boolean
  onToggle: () => void
}

export function InfoPopup({ isOpen, onToggle }: InfoPopupProps) {

  return (
    <div className="inspiration-popover" style={styles.popup}>
      <button
        onClick={onToggle}
        style={styles.trigger}
        aria-expanded={isOpen}
        aria-controls="inspiration-content"
      >
        <span>Need inspiration?</span>
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
    position: 'relative',
    background: 'transparent',
    borderRadius: '12px',
    width: 'min(220px, 42vw)',
    overflow: 'visible',
    fontFamily: 'system-ui, sans-serif',
  },
  trigger: {
    width: '100%',
    display: 'block',
    background: 'rgba(255, 255, 255, 0.76)',
    color: '#4a2ba1',
    border: '1px solid rgba(129, 93, 205, 0.22)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: 'clamp(0.8rem, 1.7vw, 0.95rem)',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  content: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: 'min(280px, calc(100vw - 32px))',
    padding: '16px 20px 20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 12px 28px rgba(74, 43, 161, 0.12)',
    boxSizing: 'border-box',
    zIndex: 2,
  },
  description: {
    margin: '0 0 0.5rem',
    fontSize: '0.9rem',
    color: '#667085',
  },
  example: {
    margin: '0 0 1rem',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: '#3c3557',
    background: '#f5efff',
    padding: '0.5rem',
    borderRadius: '6px',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid rgba(129, 93, 205, 0.16)',
    margin: '1rem 0',
  },
  list: {
    margin: 0,
    paddingLeft: '1.5rem',
    fontSize: '0.9rem',
    color: '#5d5871',
  },
}
