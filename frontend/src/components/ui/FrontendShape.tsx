import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'

// Define the shape type
export type FrontendShape = TLBaseShape<
  'frontend',
  {
    w: number
    h: number
    color: string
  }
>

// Define the shape utility class
export class FrontendShapeUtil extends BaseBoxShapeUtil<FrontendShape> {
  static override type = 'frontend' as const

  // Default props for the shape
  getDefaultProps(): FrontendShape['props'] {
    return {
      w: 180,
      h: 140,
      color: 'red'
    }
  }

  // Component that renders the shape
  component(shape: FrontendShape) {
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
          viewBox="0 0 180 140"
          style={{ 
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          {/* Modern browser window frame */}
          <rect
            x="10"
            y="20"
            width="160"
            height="100"
            fill="white"
            stroke="hsl(var(--frontend-primary))"
            strokeWidth="2"
            rx="8"
          />
          
          {/* Subtle shadow for depth */}
          <rect
            x="12"
            y="22"
            width="160"
            height="100"
            fill="hsl(var(--frontend-primary) / 0.03)"
            stroke="none"
            rx="8"
          />
          
          {/* Modern top bar */}
          <rect
            x="10"
            y="20"
            width="160"
            height="24"
            fill="hsl(var(--frontend-primary) / 0.08)"
            stroke="hsl(var(--frontend-primary))"
            strokeWidth="2"
            rx="8"
          />
          
          {/* Top bar separator line */}
          <line
            x1="10"
            y1="44"
            x2="170"
            y2="44"
            stroke="hsl(var(--frontend-primary) / 0.15)"
            strokeWidth="1"
          />
          
          {/* Modern traffic light buttons */}
          <circle cx="22" cy="32" r="3" fill="hsl(0 70% 65%)" opacity="0.9" />
          <circle cx="34" cy="32" r="3" fill="hsl(45 80% 60%)" opacity="0.9" />
          <circle cx="46" cy="32" r="3" fill="hsl(120 50% 55%)" opacity="0.9" />
          
          {/* Modern address bar */}
          <rect
            x="58"
            y="27"
            width="105"
            height="10"
            fill="hsl(var(--frontend-primary) / 0.05)"
            stroke="hsl(var(--frontend-primary) / 0.2)"
            strokeWidth="1"
            rx="5"
          />
          
          {/* Address bar content indicator */}
          <rect
            x="62"
            y="30"
            width="60"
            height="4"
            fill="hsl(var(--frontend-primary) / 0.15)"
            rx="2"
          />
          
          {/* Header content area */}
          <rect
            x="18"
            y="52"
            width="144"
            height="12"
            fill="hsl(var(--frontend-primary) / 0.06)"
            stroke="none"
            rx="3"
          />
          
          {/* Header content lines */}
          <rect x="24" y="56" width="80" height="2" fill="hsl(var(--frontend-primary) / 0.2)" rx="1" />
          <rect x="24" y="59" width="60" height="2" fill="hsl(var(--frontend-primary) / 0.15)" rx="1" />
          
          {/* Sidebar */}
          <rect
            x="18"
            y="70"
            width="36"
            height="42"
            fill="hsl(var(--frontend-primary) / 0.04)"
            stroke="hsl(var(--frontend-primary) / 0.1)"
            strokeWidth="1"
            rx="3"
          />
          
          {/* Main content area */}
          <rect
            x="60"
            y="70"
            width="102"
            height="42"
            fill="white"
            stroke="hsl(var(--frontend-primary) / 0.1)"
            strokeWidth="1"
            rx="3"
          />
          
          {/* Sidebar navigation items */}
          <rect x="22" y="76" width="28" height="3" fill="hsl(var(--frontend-primary) / 0.2)" rx="1" />
          <rect x="22" y="82" width="24" height="3" fill="hsl(var(--frontend-primary) / 0.15)" rx="1" />
          <rect x="22" y="88" width="26" height="3" fill="hsl(var(--frontend-primary) / 0.15)" rx="1" />
          <rect x="22" y="94" width="22" height="3" fill="hsl(var(--frontend-primary) / 0.15)" rx="1" />
          
          {/* Main content elements */}
          <rect x="66" y="76" width="60" height="4" fill="hsl(var(--frontend-primary) / 0.2)" rx="2" />
          <rect x="66" y="84" width="80" height="3" fill="hsl(var(--frontend-primary) / 0.1)" rx="1" />
          <rect x="66" y="90" width="75" height="3" fill="hsl(var(--frontend-primary) / 0.1)" rx="1" />
          <rect x="66" y="96" width="65" height="3" fill="hsl(var(--frontend-primary) / 0.1)" rx="1" />
          
          {/* Call-to-action button */}
          <rect
            x="130"
            y="102"
            width="24"
            height="6"
            fill="hsl(var(--frontend-primary) / 0.15)"
            stroke="hsl(var(--frontend-primary) / 0.3)"
            strokeWidth="1"
            rx="3"
          />
          
          {/* Frontend label */}
          <text 
            x="90" 
            y="134" 
            textAnchor="middle" 
            fontSize="13" 
            fill="hsl(var(--frontend-primary))"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="500"
          >
            Frontend
          </text>
        </svg>
      </HTMLContainer>
    )
  }

  // Indicator when shape is selected
  indicator(shape: FrontendShape) {
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