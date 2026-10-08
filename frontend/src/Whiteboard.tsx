import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useGeminiRealtime } from './hooks/useGeminiRealtime'
import { useArchitectureAnalysis } from './hooks/useArchitectureAnalysis'
import { DatabaseShapeUtil } from './components/ui/DatabaseShape'
import { ServerShapeUtil } from './components/ui/ServerShape'
import { UserShapeUtil } from './components/ui/UserShape'
import { LLMShapeUtil } from './components/ui/LLMShape'
import { FrontendShapeUtil } from './components/ui/FrontendShape'
import { GPTRealtimeShapeUtil } from './components/ui/GPTRealtimeShape'
import { SuggestionsPopup } from './components/SuggestionsPopup'
import { useRef, useCallback, useState } from 'react'
import { ApiKeyModal } from './components/ApiKeyModal'
import { InfoPopup } from './components/InfoPopup'
import { GoogleGenAI } from '@google/genai'

export default function Whiteboard() {
  const { isRealtimeConnected, isRealtimeConnecting, isMuted, error: realtimeError, connectRealtime, disconnectRealtime, toggleMute, setEditor: setEditorRealtime, executeToolCall } = useGeminiRealtime()
  const editorRef = useRef<any>(null)

  const [apiKey, setApiKey] = useState<string | null>(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(true)
  const [textPrompt, setTextPrompt] = useState('')
  const [isTextGenerating, setIsTextGenerating] = useState(false)
  const [textError, setTextError] = useState<string | null>(null)
  const [isTextPanelOpen, setIsTextPanelOpen] = useState(false)
  const [isInspirationPanelOpen, setIsInspirationPanelOpen] = useState(false)
  
  const architectureAnalysis = useArchitectureAnalysis(apiKey ?? '')

  // Add state to track if initial analysis has been done
  const [hasRunInitialAnalysis, setHasRunInitialAnalysis] = useState(false)

  // Note: Analysis is now triggered by shape creation events in onMount

  const createWhiteboardShape = useCallback((shapeType: string, x: number, y: number, customProps: Record<string, any> = {}) => {
    const editor = editorRef.current
    if (!editor) return null

    const shapeTypeMap = {
      database: 'database',
      person: 'user',
      server: 'server',
      gpt_5: 'llm',
      frontend: 'frontend',
      gpt_realtime: 'gpt_realtime',
    }

    const normalizedType = shapeTypeMap[shapeType as keyof typeof shapeTypeMap] || shapeType
    const dimensions = {
      database: { w: 160, h: 200, color: 'green' },
      user: { w: 120, h: 140, color: 'blue' },
      server: { w: 240, h: 160, color: 'gray' },
      llm: { w: 200, h: 160, color: 'purple' },
      frontend: { w: 180, h: 140, color: 'red' },
      gpt_realtime: { w: 220, h: 120, color: 'blue' },
    }

    const defaults = dimensions[normalizedType as keyof typeof dimensions] || { w: 200, h: 140, color: 'purple' }
    const shapeId = `shape:${(globalThis as any).crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`
    const existingShapes = editor.getCurrentPageShapes()
    const componentNumber = existingShapes
      .filter((existingShape: any) => existingShape.props?.componentType === shapeType)
      .map((existingShape: any) => Number(existingShape.props?.componentNumber))
      .filter((number: number) => Number.isFinite(number))
      .reduce((highest: number, number: number) => Math.max(highest, number), 0) + 1
    const itemNames: Record<string, string> = {
      database: 'Database',
      person: 'Person',
      server: 'Server',
      gpt_5: 'GPT 5',
      frontend: 'Frontend',
      gpt_realtime: 'GPT Realtime',
    }
    const shape = {
      id: shapeId,
      type: normalizedType,
      x,
      y,
      props: {
        ...defaults,
        ...customProps,
        componentType: shapeType,
        componentNumber,
        displayName: `${itemNames[shapeType] || shapeType} ${componentNumber}`,
      },
    }

    editor.createShapes([shape])
    return shape.id
  }, [])

  const handleApiKeySubmit = useCallback(async (submittedApiKey: string) => {
    const connected = await connectRealtime(submittedApiKey)
    if (connected) {
      setApiKey(submittedApiKey)
      setShowApiKeyModal(false)
    }
  }, [connectRealtime])

  const handleTextToWhiteboard = useCallback(async () => {
    if (!apiKey) {
      setTextError('Add your Gemini API key before generating from text.')
      setShowApiKeyModal(true)
      return
    }

    const prompt = textPrompt.trim()
    if (!prompt) {
      setTextError('Please describe the architecture you want to draw.')
      return
    }

    setIsTextGenerating(true)
    setTextError(null)

    try {
      const ai = new GoogleGenAI({ apiKey })
      const existingItems = await executeToolCall({ name: 'list_items', args: {} })
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a whiteboard CRUD command planner. Convert the user's request into a JSON list of operations and return only valid JSON, no markdown. Use this schema: { "operations": [{ "name": "draw_item", "args": { "request_id": "database_new", "item_type": "database", "x": 120, "y": 140 } }] }. Allowed operation names are draw_item, connect, list_items, update_item, delete_item, and add_text. Allowed component types are database, person, server, gpt_5, frontend, and gpt_realtime. For existing numbered components, use item_type and item_number, for example delete_item with { "item_type": "database", "item_number": 1 }. For components created in this same request, give draw_item a request_id and refer to that new component from connect or update_item using item_request_id, item1_request_id, or item2_request_id. Keep shapes spread out. Include only the operations needed. Existing numbered components are: ${JSON.stringify(existingItems)}\n\nUser request:\n${prompt}`,
              },
            ],
          },
        ],
        config: {
          temperature: 0.5,
          maxOutputTokens: 1200,
        },
      })

      const content = response.text
      if (!content) {
        throw new Error('The model returned no diagram plan.')
      }

      const cleanContent = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : cleanContent
      const parsed = JSON.parse(jsonText)
      const plan = parsed && typeof parsed === 'object' ? parsed : { components: [], connections: [], text: [] }

      const editor = editorRef.current
      if (!editor) {
        throw new Error('Whiteboard editor is not ready yet.')
      }

      const operations = Array.isArray(plan.operations) ? plan.operations : []
      if (operations.length > 0) {
        const createdItemIds = new Map<string, string>()

        for (const operation of operations) {
          const operationName = String(operation?.name || operation?.tool || '')
          if (!operationName) continue

          const operationArgs = { ...(operation.args || {}) }
          const requestId = typeof operationArgs.request_id === 'string' ? operationArgs.request_id : null
          delete operationArgs.request_id

          if (operationArgs.item_request_id) {
            operationArgs.item_uuid = createdItemIds.get(String(operationArgs.item_request_id))
            delete operationArgs.item_request_id
          }
          if (operationArgs.item1_request_id) {
            operationArgs.item1_uuid = createdItemIds.get(String(operationArgs.item1_request_id))
            delete operationArgs.item1_request_id
          }
          if (operationArgs.item2_request_id) {
            operationArgs.item2_uuid = createdItemIds.get(String(operationArgs.item2_request_id))
            delete operationArgs.item2_request_id
          }

          const result: any = await executeToolCall({ name: operationName, args: operationArgs })
          if (result?.error) throw new Error(result.error)
          if (operationName === 'draw_item' && requestId && typeof result === 'string') {
            createdItemIds.set(requestId, result)
          }
        }

        architectureAnalysis.startOrResetAnalysisTimer()
        setTextPrompt('')
        return
      }

      const shapeIdMap = new Map<string, string>()
      const components = Array.isArray(plan.components) ? plan.components : []
      const texts = Array.isArray(plan.text) ? plan.text : []

      components.forEach((component: any, index: number) => {
        const componentType = String(component.type || 'server').toLowerCase()
        const fallbackX = 160 + (index % 3) * 260
        const fallbackY = 140 + Math.floor(index / 3) * 220
        const parsedX = Number(component.x)
        const parsedY = Number(component.y)
        const x = Number.isFinite(parsedX) ? parsedX : fallbackX
        const y = Number.isFinite(parsedY) ? parsedY : fallbackY
        const key = String(component.id ?? component.label ?? `${componentType}_${index}`)
        // Do not spread optional AI values into tldraw props. In particular,
        // `{ w: undefined, h: undefined }` overwrites the valid defaults and
        // fails tldraw's JSON-serializable shape validation.
        const customProps: Record<string, number> = {}
        const width = Number(component.w)
        const height = Number(component.h)
        if (Number.isFinite(width) && width > 0) customProps.w = width
        if (Number.isFinite(height) && height > 0) customProps.h = height

        const createdId = createWhiteboardShape(componentType, x, y, customProps)

        if (createdId) {
          shapeIdMap.set(key, createdId)
        }
      })

      const connections = Array.isArray(plan.connections) ? plan.connections : []
      connections.forEach((connection: any) => {
        const fromId = typeof connection.from === 'string' ? shapeIdMap.get(connection.from) || connection.from : null
        const toId = typeof connection.to === 'string' ? shapeIdMap.get(connection.to) || connection.to : null
        if (!fromId || !toId) return

        const fromShape = editor.getShape?.(fromId)
        const toShape = editor.getShape?.(toId)
        if (!fromShape || !toShape) return

        const fromCenter = { x: fromShape.x + (fromShape.props?.w ?? 0) / 2, y: fromShape.y + (fromShape.props?.h ?? 0) / 2 }
        const toCenter = { x: toShape.x + (toShape.props?.w ?? 0) / 2, y: toShape.y + (toShape.props?.h ?? 0) / 2 }

        const edgePointRect = (center: { x: number; y: number }, halfW: number, halfH: number, toward: { x: number; y: number }) => {
          const dx = toward.x - center.x
          const dy = toward.y - center.y
          if (dx === 0 && dy === 0) return { x: center.x, y: center.y }
          const tx = halfW / Math.abs(dx || 1e-9)
          const ty = halfH / Math.abs(dy || 1e-9)
          const t = Math.min(tx, ty)
          return { x: center.x + dx * t, y: center.y + dy * t }
        }

        const edgePointEllipse = (center: { x: number; y: number }, halfW: number, halfH: number, toward: { x: number; y: number }) => {
          const dx = toward.x - center.x
          const dy = toward.y - center.y
          if (dx === 0 && dy === 0) return { x: center.x, y: center.y }
          const scale = 1 / Math.sqrt((dx * dx) / (halfW * halfW || 1e-9) + (dy * dy) / (halfH * halfH || 1e-9))
          return { x: center.x + dx * scale, y: center.y + dy * scale }
        }

        const getEdgePoint = (shape: any, toward: { x: number; y: number }) => {
          const center = { x: shape.x + (shape.props?.w ?? 0) / 2, y: shape.y + (shape.props?.h ?? 0) / 2 }
          const hw = (shape.props?.w ?? 0) / 2
          const hh = (shape.props?.h ?? 0) / 2
          if (shape.type === 'server' || shape.type === 'gpt_realtime') {
            return edgePointRect(center, hw, hh, toward)
          }
          return edgePointEllipse(center, hw, hh, toward)
        }

        const arrowId = `shape:connection_${Date.now()}_${Math.random().toString(36).slice(2)}`
        const start = getEdgePoint(fromShape, toCenter)
        const end = getEdgePoint(toShape, fromCenter)

        editor.createShapes([{
          id: arrowId,
          type: 'arrow',
          props: {
            start,
            end,
            bend: 0,
            color: 'black',
            size: 'm',
          },
        }])

        editor.createBindings([
          {
            id: `binding:${arrowId}_start`,
            type: 'arrow',
            fromId: arrowId,
            toId: fromShape.id,
            props: {
              terminal: 'start',
              isPrecise: false,
              isExact: false,
              normalizedAnchor: { x: 0.5, y: 0.5 },
            },
          },
          {
            id: `binding:${arrowId}_end`,
            type: 'arrow',
            fromId: arrowId,
            toId: toShape.id,
            props: {
              terminal: 'end',
              isPrecise: false,
              isExact: false,
              normalizedAnchor: { x: 0.5, y: 0.5 },
            },
          },
        ])
      })

      texts.forEach((entry: any) => {
        const textId = `shape:${(globalThis as any).crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`
        editor.createShapes([{
          id: textId,
          type: 'text',
          x: Number(entry.x ?? 100),
          y: Number(entry.y ?? 100),
          props: {
            text: String(entry.text || 'Architecture Summary'),
            size: 's',
            color: 'black',
          },
        }])
      })

      architectureAnalysis.startOrResetAnalysisTimer()
      setTextPrompt('')
    } catch (e: any) {
      console.error('Text-to-whiteboard generation error:', e)
      setTextError(e?.message || 'Could not generate the whiteboard from the text prompt.')
    } finally {
      setIsTextGenerating(false)
    }
  }, [apiKey, architectureAnalysis, createWhiteboardShape, executeToolCall, textPrompt])

  const handleAcceptSuggestion = useCallback((suggestion: any) => {
    const editor = editorRef.current
    if (!editor) return

    // Geometry helpers (same as in useGeminiRealtime)
    const centerOf = (s: any) => ({
      x: (s.x ?? 0) + ((s.props?.w ?? 0) / 2),
      y: (s.y ?? 0) + ((s.props?.h ?? 0) / 2),
    })

    const edgePointRect = (center: { x: number; y: number }, halfW: number, halfH: number, toward: { x: number; y: number }) => {
      const dx = toward.x - center.x
      const dy = toward.y - center.y
      if (dx === 0 && dy === 0) return { x: center.x, y: center.y }
      const tx = halfW / Math.abs(dx || 1e-9)
      const ty = halfH / Math.abs(dy || 1e-9)
      const t = Math.min(tx, ty)
      return { x: center.x + dx * t, y: center.y + dy * t }
    }

    const edgePointEllipse = (center: { x: number; y: number }, halfW: number, halfH: number, toward: { x: number; y: number }) => {
      const dx = toward.x - center.x
      const dy = toward.y - center.y
      if (dx === 0 && dy === 0) return { x: center.x, y: center.y }
      const scale = 1 / Math.sqrt((dx * dx) / (halfW * halfW || 1e-9) + (dy * dy) / (halfH * halfH || 1e-9))
      return { x: center.x + dx * scale, y: center.y + dy * scale }
    }

    const edgePoint = (s: any, toward: { x: number; y: number }) => {
      const c = centerOf(s)
      const hw = (s.props?.w ?? 0) / 2
      const hh = (s.props?.h ?? 0) / 2
      
      const shapeType = s.type
      if (shapeType === 'server' || shapeType === 'gpt_realtime') {
        return edgePointRect(c, hw, hh, toward)
      } else if (shapeType === 'database' || shapeType === 'user' || shapeType === 'llm' || shapeType === 'frontend') {
        return edgePointEllipse(c, hw, hh, toward)
      }
      return c
    }

    const uuid = (globalThis as any).crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`
    const shapeId = `shape:${uuid}`
    
    // Map suggestion component types to shape types
    const shapeTypeMap = {
      'database': 'database',
      'person': 'user', 
      'server': 'server',
      'gpt_5': 'llm',
      'frontend': 'frontend',
      'gpt_realtime': 'gpt_realtime',
    }
    
    const shape = {
      id: shapeId,
      type: shapeTypeMap[suggestion.component_type as keyof typeof shapeTypeMap] || 'server',
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      props: {
        w: suggestion.component_type === 'person' ? 120 : suggestion.component_type === 'database' ? 160 : suggestion.component_type === 'gpt_5' ? 200 : suggestion.component_type === 'frontend' ? 180 : suggestion.component_type === 'gpt_realtime' ? 220 : 240,
        h: suggestion.component_type === 'person' ? 140 : suggestion.component_type === 'database' ? 200 : suggestion.component_type === 'gpt_5' ? 160 : suggestion.component_type === 'frontend' ? 140 : suggestion.component_type === 'gpt_realtime' ? 120 : 160,
        color: suggestion.component_type === 'database' ? 'green' : suggestion.component_type === 'person' ? 'blue' : suggestion.component_type === 'server' ? 'gray' : suggestion.component_type === 'frontend' ? 'red' : suggestion.component_type === 'gpt_realtime' ? 'blue' : 'purple',
        componentType: suggestion.component_type,
        componentNumber: editor.getCurrentPageShapes()
          .filter((existingShape: any) => existingShape.props?.componentType === suggestion.component_type)
          .map((existingShape: any) => Number(existingShape.props?.componentNumber))
          .filter((number: number) => Number.isFinite(number))
          .reduce((highest: number, number: number) => Math.max(highest, number), 0) + 1,
        displayName: `${suggestion.component_type === 'database' ? 'Database' : suggestion.component_type === 'person' ? 'Person' : suggestion.component_type === 'server' ? 'Server' : suggestion.component_type === 'frontend' ? 'Frontend' : suggestion.component_type === 'gpt_realtime' ? 'GPT Realtime' : 'GPT 5'} ${editor.getCurrentPageShapes()
          .filter((existingShape: any) => existingShape.props?.componentType === suggestion.component_type)
          .map((existingShape: any) => Number(existingShape.props?.componentNumber))
          .filter((number: number) => Number.isFinite(number))
          .reduce((highest: number, number: number) => Math.max(highest, number), 0) + 1}`,
      },
    }
    
    editor.createShapes([shape])
    
    // Create connections if suggested
    if (suggestion.connections && suggestion.connections.length > 0) {
      const newShape = editor.getShape(shapeId)
      
      suggestion.connections.forEach((connection: any) => {
        const targetShapeId = `shape:${connection.to_component_id}`
        const targetShape = editor.getShape(targetShapeId)
        
        if (targetShape && newShape) {
          // Determine connection direction
          let fromShape, toShape, fromUuid, toUuid
          if (connection.direction === 'to') {
            fromShape = newShape
            toShape = targetShape
            fromUuid = uuid
            toUuid = connection.to_component_id
          } else if (connection.direction === 'from') {
            fromShape = targetShape
            toShape = newShape
            fromUuid = connection.to_component_id
            toUuid = uuid
          } else {
            // bidirectional - create one connection for now
            fromShape = newShape
            toShape = targetShape
            fromUuid = uuid
            toUuid = connection.to_component_id
          }
          
          // Calculate edge points
          const ca = centerOf(fromShape)
          const cb = centerOf(toShape)
          const start = edgePoint(fromShape, cb)
          const end = edgePoint(toShape, ca)
          
          const arrowId = `shape:connection_${fromUuid}_${toUuid}`
          
          // Create arrow with bindings
          editor.createShapes([{
            id: arrowId,
            type: 'arrow',
            props: {
              start,
              end,
              bend: 0,
              color: 'black',
              size: 'm',
            },
          }])

          // Create bindings to make the arrow stick
          editor.createBindings([
            {
              id: `binding:${arrowId}_start`,
              type: 'arrow',
              fromId: arrowId,
              toId: fromShape.id,
              props: {
                terminal: 'start',
                isPrecise: false,
                isExact: false,
                normalizedAnchor: { x: 0.5, y: 0.5 }
              }
            },
            {
              id: `binding:${arrowId}_end`,
              type: 'arrow',
              fromId: arrowId,
              toId: toShape.id,
              props: {
                terminal: 'end',
                isPrecise: false,
                isExact: false,
                normalizedAnchor: { x: 0.5, y: 0.5 }
              }
            }
          ])
          
          console.log(`Created sticky connection: ${connection.description}`)
        } else {
          console.warn(`Target shape not found: ${targetShapeId}`)
        }
      })
    }
    
    architectureAnalysis.dismissSuggestion(suggestion.id)
    
    // Queue a new analysis after adding the component
    console.log('Running analysis after component addition')
    architectureAnalysis.startOrResetAnalysisTimer()
  }, [architectureAnalysis])

  return (
    <div className="whiteboard-page">
      {showApiKeyModal && (
        <ApiKeyModal
          onApiKeySubmit={handleApiKeySubmit}
          isLoading={isRealtimeConnecting}
          error={realtimeError}
        />
      )}
      <section className="whiteboard-toolbar" aria-label="Whiteboard controls">
        {/* Voice controls */}
        <div className="whiteboard-status">
        <div className="voice-controls">
          <button
            onClick={isRealtimeConnected ? disconnectRealtime : () => setShowApiKeyModal(true)}
            disabled={isRealtimeConnecting}
            className={`connection-button ${isRealtimeConnected ? 'is-connected' : ''}`}
            style={{
              background: isRealtimeConnected ? '#ff4444' : '#4a7dff',
              opacity: isRealtimeConnecting ? 0.7 : 1,
              border: 'none',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: isRealtimeConnecting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {isRealtimeConnected ? 'Disconnect' : (isRealtimeConnecting ? 'Connecting...' : 'Connect')}
          </button>
          <button
            onClick={toggleMute}
            disabled={!isRealtimeConnected}
            className="mute-button"
            style={{
              background: isMuted ? '#888' : '#222',
              border: 'none',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: !isRealtimeConnected ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <span className={`connection-state ${isRealtimeConnected ? 'is-connected' : 'is-idle'}`}>
            {isRealtimeConnected ? (isMuted ? 'Muted' : 'Unmuted') : 'Idle'}
          </span>
        </div>
                {realtimeError && !showApiKeyModal ? (
          <span style={{ color: '#cc0000' }}>{realtimeError}</span>
        ) : null}
        </div>

      <div className="whiteboard-tools">
        <div className="text-tool">
          <button
            onClick={() => {
              setIsTextPanelOpen((open) => !open)
              setIsInspirationPanelOpen(false)
            }}
            className="text-tool-trigger"
            aria-expanded={isTextPanelOpen}
            aria-controls="text-to-whiteboard-content"
          >
            Text-to-whiteboard
          </button>
          {isTextPanelOpen && (
            <div id="text-to-whiteboard-content" className="text-tool-panel">
              <div className="text-tool-title">Describe what you want to draw</div>
              <textarea
                value={textPrompt}
                onChange={(event) => setTextPrompt(event.target.value)}
                placeholder={apiKey ? 'e.g. "Create a frontend connected to server 1, then delete database 2"' : 'Add your API key first to enable text generation'}
                disabled={!apiKey || isTextGenerating}
              />
              <button
                onClick={handleTextToWhiteboard}
                disabled={!apiKey || isTextGenerating}
                className="generate-board-button"
              >
                {isTextGenerating ? 'Generating...' : 'Generate Board'}
              </button>
              {textError ? <div className="text-tool-error">{textError}</div> : null}
            </div>
          )}
        </div>
        <InfoPopup
          isOpen={isInspirationPanelOpen}
          onToggle={() => {
            setIsInspirationPanelOpen((open) => !open)
            setIsTextPanelOpen(false)
          }}
        />
      </div>
      </section>

      <main className="whiteboard-board">
        <Tldraw 
          shapeUtils={[DatabaseShapeUtil, ServerShapeUtil, UserShapeUtil, LLMShapeUtil, FrontendShapeUtil, GPTRealtimeShapeUtil]}
          onMount={(editor) => {
          // Provide editor to hooks
          setEditorRealtime(editor)
          editorRef.current = editor
          architectureAnalysis.setEditor(editor)
          console.log('tldraw editor mounted, setting up shape change listener...')
          
          // Listen for shape changes and trigger analysis when new components are added
          editor.sideEffects.registerAfterCreateHandler('shape', (shape) => {
            console.log('🎯 New shape created:', shape.type, shape.id)
            
            // Only trigger analysis for our custom component types, not arrows
            if (['database', 'user', 'server', 'llm', 'frontend', 'gpt_realtime'].includes(shape.type)) {
              console.log('🎯 Component added, queuing analysis in 10 seconds...')
              architectureAnalysis.startOrResetAnalysisTimer()
            }
          })
          
          // Initial analysis if shapes already exist
          setTimeout(() => {
            const shapes = editor.getCurrentPageShapes()
            console.log('Editor mounted, shapes:', shapes?.length || 0)
            if (shapes && shapes.length > 0 && apiKey && !hasRunInitialAnalysis) {
              console.log('Triggering initial analysis from onMount')
              architectureAnalysis.startOrResetAnalysisTimer()
              setHasRunInitialAnalysis(true)
            }
          }, 1000)
          }}
        />

        {/* Architecture Suggestions Popup */}
        <SuggestionsPopup
          suggestions={architectureAnalysis.suggestions}
          isAnalyzing={architectureAnalysis.isAnalyzing}
          error={architectureAnalysis.error}
          onDismiss={architectureAnalysis.dismissSuggestion}
          onClearAll={architectureAnalysis.clearSuggestions}
          onAcceptSuggestion={handleAcceptSuggestion}
        />
      </main>
    </div>
  )
}
