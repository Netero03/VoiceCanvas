

interface ArchitectureSuggestion {
  id: string
  title: string
  description: string
  component_type: 'database' | 'person' | 'server' | 'gpt_5' | 'frontend' | 'gpt_realtime'
  reasoning: string
  connections?: Array<{
    to_component_id: string
    direction: 'from' | 'to' | 'bidirectional'
    description: string
  }>
}

interface SuggestionsPopupProps {
  suggestions: ArchitectureSuggestion[]
  isAnalyzing: boolean
  error: string | null
  onDismiss: (id: string) => void
  onClearAll: () => void
  onAcceptSuggestion: (suggestion: ArchitectureSuggestion) => void
}

const getComponentIcon = (type: string) => {
  switch (type) {
    case 'database':
      return '🗄️'
    case 'person':
      return '👤'
    case 'server':
      return '🖥️'
    case 'gpt_5':
      return '🤖'
    case 'frontend':
      return '🖥️'
    case 'gpt_realtime':
      return '🎤'
    default:
      return '📦'
  }
}

const getComponentColor = (type: string) => {
  switch (type) {
    case 'database':
      return '#10b981' // green
    case 'person':
      return '#3b82f6' // blue
    case 'server':
      return '#6b7280' // gray
    case 'gpt_5':
      return '#8b5cf6' // purple
    case 'gpt_realtime':
      return '#3b82f6' // blue
    default:
      return '#64748b'
  }
}

export function SuggestionsPopup({
  suggestions,
  isAnalyzing,
  error,
  onDismiss,
  onClearAll,
  onAcceptSuggestion,
}: SuggestionsPopupProps) {
  // Only show popup when there are actual suggestions to display
  const hasContent = suggestions.length > 0

  if (!hasContent) {
    return null // No UI when there are no suggestions
  }

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1000,
      background: 'white',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.25)',
      width: '320px',
      maxHeight: '500px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>
            💡 Architecture Suggestions
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {suggestions.length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {error && (
          <div style={{
            padding: '16px',
            background: '#fef2f2',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {suggestions.length === 0 && !isAnalyzing && !error && (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
            <p style={{ margin: 0, fontSize: '14px' }}>Architecture looks complete!</p>
          </div>
        )}

        {suggestions.map((suggestion) => (
          <div key={suggestion.id} style={{
            padding: '12px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>
                  {getComponentIcon(suggestion.component_type)}
                </span>
                <h4 style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {suggestion.title}
                </h4>
              </div>
              <button
                onClick={() => onDismiss(suggestion.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                  lineHeight: '1'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{
              margin: '0 0 6px 0',
              fontSize: '12px',
              color: '#4b5563',
              lineHeight: '1.3'
            }}>
              {suggestion.description}
            </p>

            {suggestion.connections && suggestion.connections.length > 0 && (
              <div style={{
                margin: '0 0 8px 0',
                fontSize: '10px',
                color: '#059669',
                background: '#ecfdf5',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid #d1fae5'
              }}>
                → {suggestion.connections.map(c => c.description).join(', ')}
              </div>
            )}

            <button
              onClick={() => onAcceptSuggestion(suggestion)}
              style={{
                background: getComponentColor(suggestion.component_type),
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{getComponentIcon(suggestion.component_type)}</span>
              Add to Diagram
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
