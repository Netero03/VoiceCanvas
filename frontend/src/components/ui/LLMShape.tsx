import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'

// Define the shape type
export type LLMShape = TLBaseShape<
  'llm',
  {
    w: number
    h: number
    color: string
  }
>

// Define the shape utility class
export class LLMShapeUtil extends BaseBoxShapeUtil<LLMShape> {
  static override type = 'llm' as const

  // Default props for the shape
  getDefaultProps(): LLMShape['props'] {
    return {
      w: 200,
      h: 160,
      color: 'purple'
    }
  }

  // Component that renders the shape
  component(shape: LLMShape) {
    const bounds = this.getGeometry(shape).bounds
    
    return (
      <HTMLContainer
        style={{
          width: bounds.width,
          height: bounds.height,
        }}
      >
        <svg
          width={bounds.width}
          height={bounds.height}
          viewBox="0 0 200 160"
          style={{ 
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          {/* Main brain-like outline */}
          <path
            d="M40 50 C30 40, 30 30, 50 30 C60 20, 80 20, 90 30 C100 20, 120 20, 130 30 C150 30, 170 40, 160 50 C170 60, 170 70, 160 80 C170 90, 160 100, 150 100 C140 110, 120 110, 110 100 C100 110, 80 110, 70 100 C60 110, 40 110, 30 100 C20 90, 30 80, 40 70 C30 60, 30 50, 40 50 Z"
            fill="hsl(var(--llm-primary) / 0.1)"
            stroke="hsl(var(--llm-primary))"
            strokeWidth="3"
          />
          
          {/* Neural network nodes */}
          <circle cx="60" cy="50" r="3" fill="hsl(var(--llm-secondary))" />
          <circle cx="90" cy="40" r="3" fill="hsl(var(--llm-accent))" />
          <circle cx="120" cy="50" r="3" fill="hsl(var(--llm-primary))" />
          <circle cx="140" cy="70" r="3" fill="hsl(var(--llm-secondary))" />
          <circle cx="110" cy="80" r="3" fill="hsl(var(--llm-accent))" />
          <circle cx="80" cy="90" r="3" fill="hsl(var(--llm-primary))" />
          <circle cx="50" cy="80" r="3" fill="hsl(var(--llm-secondary))" />
          <circle cx="70" cy="60" r="3" fill="hsl(var(--llm-accent))" />
          
          {/* Neural connections */}
          <line x1="60" y1="50" x2="90" y2="40" stroke="hsl(var(--llm-secondary))" strokeWidth="2" opacity="0.8" />
          <line x1="90" y1="40" x2="120" y2="50" stroke="hsl(var(--llm-accent))" strokeWidth="2" opacity="0.8" />
          <line x1="120" y1="50" x2="140" y2="70" stroke="hsl(var(--llm-primary))" strokeWidth="2" opacity="0.8" />
          <line x1="140" y1="70" x2="110" y2="80" stroke="hsl(var(--llm-secondary))" strokeWidth="2" opacity="0.8" />
          <line x1="110" y1="80" x2="80" y2="90" stroke="hsl(var(--llm-accent))" strokeWidth="2" opacity="0.8" />
          <line x1="80" y1="90" x2="50" y2="80" stroke="hsl(var(--llm-primary))" strokeWidth="2" opacity="0.8" />
          <line x1="50" y1="80" x2="60" y2="50" stroke="hsl(var(--llm-secondary))" strokeWidth="2" opacity="0.8" />
          <line x1="70" y1="60" x2="90" y2="40" stroke="hsl(var(--llm-accent))" strokeWidth="2" opacity="0.8" />
          <line x1="70" y1="60" x2="110" y2="80" stroke="hsl(var(--llm-primary))" strokeWidth="2" opacity="0.8" />
          
          {/* GPT-5 label */}
          <text 
            x="100" 
            y="136" 
            textAnchor="middle" 
            fontSize="16" 
            fill="hsl(var(--llm-primary))"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            GPT 5
          </text>
        </svg>
      </HTMLContainer>
    )
  }

  // Indicator when shape is selected
  indicator(shape: LLMShape) {
    const bounds = this.getGeometry(shape).bounds
    return (
      <rect
        width={bounds.width}
        height={bounds.height}
        fill="none"
        stroke="var(--color-selected)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
    )
  }
}