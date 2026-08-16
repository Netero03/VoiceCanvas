import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'

// Define the shape type
export type UserShape = TLBaseShape<
  'user',
  {
    w: number
    h: number
    color: string
  }
>

// Define the shape utility class
export class UserShapeUtil extends BaseBoxShapeUtil<UserShape> {
  static override type = 'user' as const

  // Default props for the shape
  getDefaultProps(): UserShape['props'] {
    return {
      w: 120,
      h: 140,
      color: 'blue'
    }
  }

  // Component that renders the shape
  component(shape: UserShape) {
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
          viewBox="0 0 120 140"
          style={{ 
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          {/* Head */}
          <circle 
            cx="60" 
            cy="28" 
            r="14" 
            fill="none"
            stroke="hsl(var(--user-primary))" 
            strokeWidth="3"
          />

          {/* Torso */}
          <line 
            x1="60" 
            y1="48" 
            x2="60" 
            y2="96" 
            stroke="hsl(var(--user-primary))" 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Arms */}
          <line 
            x1="60" 
            y1="62" 
            x2="40" 
            y2="78" 
            stroke="hsl(var(--user-primary))" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <line 
            x1="60" 
            y1="62" 
            x2="80" 
            y2="78" 
            stroke="hsl(var(--user-primary))" 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Legs */}
          <line 
            x1="60" 
            y1="96" 
            x2="46" 
            y2="124" 
            stroke="hsl(var(--user-primary))" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <line 
            x1="60" 
            y1="96" 
            x2="74" 
            y2="124" 
            stroke="hsl(var(--user-primary))" 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* User label */}
          <text 
            x="60" 
            y="136" 
            textAnchor="middle" 
            fontSize="12" 
            fill="hsl(var(--user-primary))"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="500"
          >
            User
          </text>
        </svg>
      </HTMLContainer>
    )
  }

  // Indicator when shape is selected
  indicator(shape: UserShape) {
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