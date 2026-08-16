import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from 'tldraw'

// Define the shape type
export type GPTRealtimeShape = TLBaseShape<
  'gpt_realtime',
  {
    w: number
    h: number
    color: string
  }
>

// Define the shape utility class
export class GPTRealtimeShapeUtil extends BaseBoxShapeUtil<GPTRealtimeShape> {
  static override type = 'gpt_realtime' as const

  // Default props for the shape
  getDefaultProps(): GPTRealtimeShape['props'] {
    return {
      w: 220,
      h: 120,
      color: 'blue'
    }
  }

  // Component that renders the shape
  component(shape: GPTRealtimeShape) {
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
          viewBox="0 0 220 120"
          style={{ 
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          {/* Background rounded rectangle */}
          <rect
            x="10"
            y="10"
            width="200"
            height="85"
            fill="hsl(210 100% 97%)"
            stroke="hsl(210 80% 60%)"
            strokeWidth="3"
            rx="16"
          />
          
          {/* Waveform visualization */}
          <g transform="translate(20, 60)">
            {/* Waveform bars - creating a realistic audio waveform pattern */}
            <rect x="0" y="-4" width="2.5" height="8" fill="hsl(210 80% 60%)" opacity="0.4" rx="1" />
            <rect x="4" y="-8" width="2.5" height="16" fill="hsl(210 80% 60%)" opacity="0.5" rx="1" />
            <rect x="8" y="-3" width="2.5" height="6" fill="hsl(210 80% 60%)" opacity="0.4" rx="1" />
            <rect x="12" y="-12" width="2.5" height="24" fill="hsl(210 80% 60%)" opacity="0.7" rx="1" />
            <rect x="16" y="-10" width="2.5" height="20" fill="hsl(210 80% 60%)" opacity="0.6" rx="1" />
            <rect x="20" y="-15" width="2.5" height="30" fill="hsl(210 80% 60%)" opacity="0.8" rx="1" />
            <rect x="24" y="-13" width="2.5" height="26" fill="hsl(210 80% 60%)" opacity="0.7" rx="1" />
            <rect x="28" y="-18" width="2.5" height="36" fill="hsl(210 80% 60%)" opacity="0.9" rx="1" />
            <rect x="32" y="-20" width="2.5" height="40" fill="hsl(210 80% 60%)" opacity="1.0" rx="1" />
            <rect x="36" y="-16" width="2.5" height="32" fill="hsl(210 80% 60%)" opacity="0.8" rx="1" />
            <rect x="40" y="-22" width="2.5" height="44" fill="hsl(210 80% 60%)" opacity="1.0" rx="1" />
            <rect x="44" y="-19" width="2.5" height="38" fill="hsl(210 80% 60%)" opacity="0.9" rx="1" />
            <rect x="48" y="-14" width="2.5" height="28" fill="hsl(210 80% 60%)" opacity="0.7" rx="1" />
            <rect x="52" y="-24" width="2.5" height="48" fill="hsl(210 80% 60%)" opacity="1.0" rx="1" />
            <rect x="56" y="-21" width="2.5" height="42" fill="hsl(210 80% 60%)" opacity="0.95" rx="1" />
            <rect x="60" y="-17" width="2.5" height="34" fill="hsl(210 80% 60%)" opacity="0.8" rx="1" />
            <rect x="64" y="-23" width="2.5" height="46" fill="hsl(210 80% 60%)" opacity="1.0" rx="1" />
            <rect x="68" y="-20" width="2.5" height="40" fill="hsl(210 80% 60%)" opacity="0.9" rx="1" />
            <rect x="72" y="-12" width="2.5" height="24" fill="hsl(210 80% 60%)" opacity="0.6" rx="1" />
            <rect x="76" y="-16" width="2.5" height="32" fill="hsl(210 80% 60%)" opacity="0.8" rx="1" />
            <rect x="80" y="-11" width="2.5" height="22" fill="hsl(210 80% 60%)" opacity="0.6" rx="1" />
            <rect x="84" y="-14" width="2.5" height="28" fill="hsl(210 80% 60%)" opacity="0.7" rx="1" />
            <rect x="88" y="-9" width="2.5" height="18" fill="hsl(210 80% 60%)" opacity="0.5" rx="1" />
            <rect x="92" y="-17" width="2.5" height="34" fill="hsl(210 80% 60%)" opacity="0.8" rx="1" />
            <rect x="96" y="-13" width="2.5" height="26" fill="hsl(210 80% 60%)" opacity="0.7" rx="1" />
            <rect x="100" y="-8" width="2.5" height="16" fill="hsl(210 80% 60%)" opacity="0.5" rx="1" />
            <rect x="104" y="-11" width="2.5" height="22" fill="hsl(210 80% 60%)" opacity="0.6" rx="1" />
            <rect x="108" y="-7" width="2.5" height="14" fill="hsl(210 80% 60%)" opacity="0.4" rx="1" />
            <rect x="112" y="-10" width="2.5" height="20" fill="hsl(210 80% 60%)" opacity="0.5" rx="1" />
            <rect x="116" y="-5" width="2.5" height="10" fill="hsl(210 80% 60%)" opacity="0.4" rx="1" />
            <rect x="120" y="-8" width="2.5" height="16" fill="hsl(210 80% 60%)" opacity="0.5" rx="1" />
            <rect x="124" y="-4" width="2.5" height="8" fill="hsl(210 80% 60%)" opacity="0.3" rx="1" />
            <rect x="128" y="-6" width="2.5" height="12" fill="hsl(210 80% 60%)" opacity="0.4" rx="1" />
            <rect x="132" y="-5" width="2.5" height="10" fill="hsl(210 80% 60%)" opacity="0.4" rx="1" />
            <rect x="136" y="-3" width="2.5" height="6" fill="hsl(210 80% 60%)" opacity="0.3" rx="1" />
            <rect x="140" y="-4" width="2.5" height="8" fill="hsl(210 80% 60%)" opacity="0.3" rx="1" />
            <rect x="144" y="-2" width="2.5" height="4" fill="hsl(210 80% 60%)" opacity="0.3" rx="1" />
            <rect x="148" y="-3" width="2.5" height="6" fill="hsl(210 80% 60%)" opacity="0.3" rx="1" />
            <rect x="152" y="-1" width="2.5" height="2" fill="hsl(210 80% 60%)" opacity="0.2" rx="1" />
            <rect x="156" y="-2" width="2.5" height="4" fill="hsl(210 80% 60%)" opacity="0.3" rx="1" />
            <rect x="160" y="-1" width="2.5" height="2" fill="hsl(210 80% 60%)" opacity="0.2" rx="1" />
            <rect x="164" y="-2" width="2.5" height="4" fill="hsl(210 80% 60%)" opacity="0.2" rx="1" />
            <rect x="168" y="-1" width="2.5" height="2" fill="hsl(210 80% 60%)" opacity="0.2" rx="1" />
            <rect x="172" y="-1" width="2.5" height="2" fill="hsl(210 80% 60%)" opacity="0.2" rx="1" />
          </g>
          
          {/* Status indicator dot */}
          <circle 
            cx="25" 
            cy="25" 
            r="4" 
            fill="hsl(120 70% 50%)"
          />
          
          {/* "Agent online" text */}
          <text 
            x="35" 
            y="29" 
            fontSize="12" 
            fill="hsl(210 80% 40%)"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
          >
            Agent online
          </text>
          
          {/* Play/Pause button circle */}
          <circle 
            cx="110" 
            cy="75" 
            r="10" 
            fill="hsl(210 80% 60%)"
          />
          
          {/* Pause icon (two vertical bars) */}
          <rect x="106" y="70" width="2.5" height="10" fill="white" rx="1" />
          <rect x="111.5" y="70" width="2.5" height="10" fill="white" rx="1" />
          
          {/* Time display */}
          <text 
            x="195" 
            y="29" 
            fontSize="12" 
            fill="hsl(210 80% 40%)"
            fontFamily="system-ui, sans-serif"
            fontWeight="600"
            textAnchor="end"
          >
            00:35
          </text>
          
          {/* GPT Realtime label */}
          <text 
            x="110" 
            y="110" 
            textAnchor="middle" 
            fontSize="16" 
            fill="hsl(210 80% 60%)"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
          >
            GPT Realtime
          </text>
        </svg>
      </HTMLContainer>
    )
  }

  // Indicator when shape is selected
  indicator(shape: GPTRealtimeShape) {
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
