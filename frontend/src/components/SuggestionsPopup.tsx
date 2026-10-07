

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
      border: '1px solid rgba(129, 93, 205, 0.24)',
      borderRadius: '12px',
      boxShadow: '0 16px 36px rgba(74, 43, 161, 0.18)',
      width: '320px',
      maxHeight: '500px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #f5efff 0%, #fff0fa 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#171b2d' }}>
            💡 Architecture Suggestions
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {suggestions.length > 0 && (
            <button
              onClick={onClearAll}
              style={{
                background: '#c2418a',
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
            background: '#fff0f7',
            color: '#b04476',
            fontSize: '14px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {suggestions.length === 0 && !isAnalyzing && !error && (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: '#667085'
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
                  color: '#171b2d'
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
              color: '#5d5871',
              lineHeight: '1.3'
            }}>
              {suggestion.description}
            </p>

            {suggestion.connections && suggestion.connections.length > 0 && (
              <div style={{
                margin: '0 0 8px 0',
                fontSize: '10px',
                color: '#3f8d68',
                background: '#eefaf3',
                padding: '2px 6px',
                borderRadius: '3px',
                border: '1px solid #ccebd8'
              }}>
                → {suggestion.connections.map(c => c.description).join(', ')}
              </div>
            )}

            <button
              onClick={() => onAcceptSuggestion(suggestion)}
              style={{
                background: 'linear-gradient(135deg, #6437c7, #c13ca8)',
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
