import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'

// Define the shape type
export type ServerShape = TLBaseShape<
  'server',
  {
    w: number
    h: number
    color: string
  }
>

// Define the shape utility class
export class ServerShapeUtil extends BaseBoxShapeUtil<ServerShape> {
  static override type = 'server' as const

  // Default props for the shape
  getDefaultProps(): ServerShape['props'] {
    return {
      w: 240,
      h: 160,
      color: 'gray'
    }
  }

  // Component that renders the shape
  component(shape: ServerShape) {
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
          viewBox="0 0 240 160"
          style={{ 
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          {/* 3D Server Box */}
          
          {/* Front face */}
          <rect
            x="30"
            y="50"
            width="140"
            height="80"
            fill="hsl(var(--server-primary) / 0.1)"
            stroke="hsl(var(--server-primary))"
            strokeWidth="3"
          />
          
          {/* Top face (parallelogram for 3D effect) */}
          <path
            d="M30 50 L50 30 L190 30 L170 50 Z"
            fill="hsl(var(--server-secondary) / 0.2)"
            stroke="hsl(var(--server-secondary))"
            strokeWidth="3"
          />
          
          {/* Right side face (parallelogram for 3D effect) */}
          <path
            d="M170 50 L190 30 L190 110 L170 130 Z"
            fill="hsl(var(--server-secondary) / 0.15)"
            stroke="hsl(var(--server-secondary))"
            strokeWidth="3"
          />
          
          {/* Server details - front panel */}
          <rect
            x="40"
            y="60"
            width="120"
            height="16"
            fill="hsl(var(--server-accent) / 0.3)"
            stroke="hsl(var(--server-primary))"
            strokeWidth="2"
          />
          
          <rect
            x="40"
            y="84"
            width="120"
            height="16"
            fill="hsl(var(--server-accent) / 0.3)"
            stroke="hsl(var(--server-primary))"
            strokeWidth="2"
          />
          
          <rect
            x="40"
            y="108"
            width="120"
            height="16"
            fill="hsl(var(--server-accent) / 0.3)"
            stroke="hsl(var(--server-primary))"
            strokeWidth="2"
          />
          
          {/* Power indicators */}
          <circle cx="50" cy="68" r="3" fill="hsl(var(--server-secondary))" />
          <circle cx="50" cy="92" r="3" fill="hsl(var(--server-secondary))" />
          <circle cx="50" cy="116" r="3" fill="hsl(var(--server-secondary))" />
          
          {/* Vents on right side */}
          <line x1="176" y1="40" x2="176" y2="100" stroke="hsl(var(--server-secondary))" strokeWidth="2" opacity="0.8" />
          <line x1="180" y1="44" x2="180" y2="96" stroke="hsl(var(--server-secondary))" strokeWidth="2" opacity="0.8" />
          <line x1="184" y1="48" x2="184" y2="92" stroke="hsl(var(--server-secondary))" strokeWidth="2" opacity="0.8" />
          
          {/* Server label */}
          <text 
            x="120" 
            y="152" 
            textAnchor="middle" 
            fontSize="16" 
            fill="hsl(var(--server-primary))"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            Server
          </text>
        </svg>
      </HTMLContainer>
    )
  }

  // Indicator when shape is selected
  indicator(shape: ServerShape) {
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