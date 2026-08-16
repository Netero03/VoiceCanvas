import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'

// Define the shape type
export type DatabaseShape = TLBaseShape<
  'database',
  {
    w: number
    h: number
    color: string
  }
>

// Define the shape utility class
export class DatabaseShapeUtil extends BaseBoxShapeUtil<DatabaseShape> {
  static override type = 'database' as const

  // Default props for the shape
  getDefaultProps(): DatabaseShape['props'] {
    return {
      w: 160,
      h: 200,
      color: 'green'
    }
  }

  // Component that renders the shape
  component(shape: DatabaseShape) {
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
          viewBox="0 0 160 200"
          style={{ 
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          {/* Database cylinder body */}
          <rect
            x="40"
            y="30"
            width="80"
            height="140"
            fill="hsl(var(--database-primary) / 0.05)"
            stroke="hsl(var(--database-primary))"
            strokeWidth="3"
          />
          
          {/* Top disk (ellipse) */}
          <ellipse
            cx="80"
            cy="30"
            rx="40"
            ry="12"
            fill="hsl(var(--database-primary) / 0.3)"
            stroke="hsl(var(--database-primary))"
            strokeWidth="3"
          />
          
          {/* Middle disk */}
          <ellipse
            cx="80"
            cy="80"
            rx="40"
            ry="12"
            fill="hsl(var(--database-secondary) / 0.3)"
            stroke="hsl(var(--database-secondary))"
            strokeWidth="3"
          />
          
          {/* Bottom disk */}
          <ellipse
            cx="80"
            cy="130"
            rx="40"
            ry="12"
            fill="hsl(var(--database-accent) / 0.3)"
            stroke="hsl(var(--database-accent))"
            strokeWidth="3"
          />
          
          {/* Bottom cap (full ellipse) */}
          <ellipse
            cx="80"
            cy="170"
            rx="40"
            ry="12"
            fill="hsl(var(--database-primary) / 0.4)"
            stroke="hsl(var(--database-primary))"
            strokeWidth="3"
          />
          
          {/* Data visualization dots */}
          <circle cx="60" cy="50" r="2" fill="hsl(var(--database-accent))" opacity="0.8" />
          <circle cx="70" cy="56" r="2" fill="hsl(var(--database-secondary))" opacity="0.8" />
          <circle cx="90" cy="54" r="2" fill="hsl(var(--database-primary))" opacity="0.8" />
          <circle cx="100" cy="52" r="2" fill="hsl(var(--database-accent))" opacity="0.8" />
          
          <circle cx="64" cy="100" r="2" fill="hsl(var(--database-primary))" opacity="0.8" />
          <circle cx="80" cy="104" r="2" fill="hsl(var(--database-secondary))" opacity="0.8" />
          <circle cx="96" cy="102" r="2" fill="hsl(var(--database-accent))" opacity="0.8" />
          
          {/* Database label */}
          <text 
            x="80" 
            y="205" 
            textAnchor="middle" 
            fontSize="14" 
            fill="hsl(var(--database-primary))"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            Database
          </text>
        </svg>
      </HTMLContainer>
    )
  }

  // Indicator when shape is selected
  indicator(shape: DatabaseShape) {
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