import { useCallback, useRef, useState } from 'react'
import { GoogleGenAI, Modality, Type } from '@google/genai'

const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025'
const CONNECT_TIMEOUT_MS = 15000

interface UseGeminiRealtimeState {
  isRealtimeConnected: boolean
  isRealtimeConnecting: boolean
  isMuted: boolean
  error: string | null
  connectRealtime: (apiKey: string) => Promise<boolean>
  disconnectRealtime: () => void
  toggleMute: () => void
  setEditor: (editor: any) => void
}

type WhiteboardItemType = 'database' | 'person' | 'server' | 'gpt_5' | 'frontend' | 'gpt_realtime'

interface ToolCallLike {
  id?: string
  name?: string
  args?: unknown
}

export function useGeminiRealtime(): UseGeminiRealtimeState {
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false)
  const [isRealtimeConnecting, setIsRealtimeConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionRef = useRef<any>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null)
  const editorRef = useRef<any>(null)


  const SYSTEM_PROMPT =
    'You are Rubber Ducky Bot. The user is discussing how their system architecture will look. When the user asks to draw, add, connect, delete, or label anything on the whiteboard, you MUST execute the appropriate tool calls immediately. Do not merely describe the change or ask for confirmation. For a request to draw a database and a server and connect them, first call draw_item for each item, then use the UUIDs returned by the tool responses to call connect. If they go on a longwinded rant about the different components of their system, write that on the side, using dashes as bullet points. It will be a briefer version of what they want. Be brief and concise, but kind and friendly. Interpret spoken instructions as immediate tool calls. If they describe what their product is going to be at a high level, also add text that explains that with bullet points.' +
    'Do not wait for full sentences if a coherent unit of action is clear. ' +
    'Allowed item types: database, person, server, gpt_5, frontend, gpt_realtime. Return UUIDs from draw_item and reuse them.' +
    'Don\'t be too chatty. Just do what the user asks for, with brief responses.' + 
    'IMPORTANT: When drawing items, add AMPLE, PLENTY, LOTS of space between the objects.'

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
    }
    if (shapeType === 'database' || shapeType === 'user' || shapeType === 'llm') {
      return edgePointEllipse(c, hw, hh, toward)
    }
    return c
  }

  const drawItem = useCallback(async ({ item_type, x, y }: { item_type: WhiteboardItemType; x: number; y: number }) => {
    const editor = editorRef.current
    if (!editor) throw new Error('Editor not initialised')

    const uuid = (globalThis as any).crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`
    const shapeId = `shape:${uuid}`

    const shapeTypeMap = {
      database: 'database',
      person: 'user',
      server: 'server',
      gpt_5: 'llm',
      frontend: 'frontend',
      gpt_realtime: 'gpt_realtime',
    }

    const shape = {
      id: shapeId,
      type: shapeTypeMap[item_type],
      x,
      y,
      props: {
        w: item_type === 'person' ? 120 : item_type === 'database' ? 160 : item_type === 'gpt_5' ? 200 : item_type === 'frontend' ? 180 : item_type === 'gpt_realtime' ? 220 : 240,
        h: item_type === 'person' ? 140 : item_type === 'database' ? 200 : item_type === 'gpt_5' ? 160 : item_type === 'frontend' ? 140 : item_type === 'gpt_realtime' ? 120 : 160,
        color: item_type === 'database' ? 'green' : item_type === 'person' ? 'blue' : item_type === 'server' ? 'gray' : item_type === 'frontend' ? 'red' : item_type === 'gpt_realtime' ? 'blue' : 'purple',
      },
    }

    editor.createShapes([shape])
    return uuid
  }, [])

  const connectItems = useCallback(async ({ item1_uuid, item2_uuid, direction = 'one_way' }: { item1_uuid: string; item2_uuid: string; direction?: 'one_way' | 'two_way' }) => {
    const editor = editorRef.current
    if (!editor) throw new Error('Editor not initialised')

    const a = editor.getShape?.(`shape:${item1_uuid}`)
    const b = editor.getShape?.(`shape:${item2_uuid}`)
    if (!a || !b) throw new Error('One or both items not found on canvas')

    const ca = centerOf(a)
    const cb = centerOf(b)
    const start = edgePoint(a, cb)
    const end = edgePoint(b, ca)

    if (direction === 'two_way') {
      const arrowId = `shape:bidirectional_${item1_uuid}_${item2_uuid}`

      editor.createShapes([
        {
          id: arrowId,
          type: 'arrow',
          props: {
            start,
            end,
            bend: 0,
            color: 'black',
            size: 'm',
            arrowheadStart: 'arrow',
            arrowheadEnd: 'arrow',
          },
        },
      ])

      editor.createBindings([
        {
          id: `binding:${arrowId}_start`,
          type: 'arrow',
          fromId: arrowId,
          toId: `shape:${item1_uuid}`,
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
          toId: `shape:${item2_uuid}`,
          props: {
            terminal: 'end',
            isPrecise: false,
            isExact: false,
            normalizedAnchor: { x: 0.5, y: 0.5 },
          },
        },
      ])
    } else {
      const arrowId = `shape:connection_${item1_uuid}_${item2_uuid}`

      editor.createShapes([
        {
          id: arrowId,
          type: 'arrow',
          props: {
            start,
            end,
            bend: 0,
            color: 'black',
            size: 'm',
          },
        },
      ])

      editor.createBindings([
        {
          id: `binding:${arrowId}_start`,
          type: 'arrow',
          fromId: arrowId,
          toId: `shape:${item1_uuid}`,
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
          toId: `shape:${item2_uuid}`,
          props: {
            terminal: 'end',
            isPrecise: false,
            isExact: false,
            normalizedAnchor: { x: 0.5, y: 0.5 },
          },
        },
      ])
    }

    return 'ok'
  }, [])

  const deleteItem = useCallback(async ({ item_uuid }: { item_uuid: string }) => {
    const editor = editorRef.current
    if (!editor) throw new Error('Editor not initialised')

    const shape = editor.getShape?.(`shape:${item_uuid}`)
    if (shape) editor.deleteShapes([shape.id])
    return 'ok'
  }, [])

  const addText = useCallback(async ({ text, x, y }: { text: string; x: number; y: number }) => {
    const editor = editorRef.current
    if (!editor) throw new Error('Editor not initialised')

    const uuid = (globalThis as any).crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`
    const shape = {
      id: `shape:${uuid}`,
      type: 'text',
      x,
      y,
      props: {
        text,
        size: 's',
        color: 'black',
      },
    }
    editor.createShapes([shape])
    return uuid
  }, [])

  const executeToolCall = useCallback(async (toolCall: ToolCallLike) => {
    const toolName = toolCall.name
    if (!toolName) return { error: 'Tool call missing name' }

    let parsedArgs: any = {}
    const rawArgs = toolCall.args
    if (typeof rawArgs === 'string') {
      try {
        parsedArgs = JSON.parse(rawArgs)
      } catch {
        parsedArgs = {}
      }
    } else if (rawArgs && typeof rawArgs === 'object') {
      parsedArgs = rawArgs
    }

    switch (toolName) {
      case 'draw_item':
        return drawItem(parsedArgs)
      case 'connect':
        return connectItems(parsedArgs)
      case 'delete_item':
        return deleteItem(parsedArgs)
      case 'add_text':
        return addText(parsedArgs)
      default:
        return { error: `Unknown tool: ${toolName}` }
    }
  }, [addText, connectItems, deleteItem, drawItem])

  const startMicrophoneStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStreamRef.current = stream

    // Live API expects raw signed 16-bit PCM, not MediaRecorder's WebM/Opus
    // chunks. Requesting 16 kHz keeps bandwidth and latency low; browsers that
    // choose another rate are supported by sending that rate in the MIME type.
    const audioContext = new AudioContext({ sampleRate: 16000 })
    audioContextRef.current = audioContext
    await audioContext.resume()

    const source = audioContext.createMediaStreamSource(stream)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)
    audioSourceRef.current = source
    audioProcessorRef.current = processor

    processor.onaudioprocess = (event) => {
      const session = sessionRef.current
      if (!session) return

      try {
        const samples = event.inputBuffer.getChannelData(0)
        const pcm = new Int16Array(samples.length)
        for (let index = 0; index < samples.length; index += 1) {
          const sample = Math.max(-1, Math.min(1, samples[index]))
          pcm[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        }

        const bytes = new Uint8Array(pcm.buffer)
        let binary = ''
        for (let offset = 0; offset < bytes.length; offset += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
        }

        session.sendRealtimeInput({
          audio: {
            data: btoa(binary),
            mimeType: `audio/pcm;rate=${audioContext.sampleRate}`,
          },
        })
      } catch (sendError) {
        console.error('Failed to send realtime audio chunk:', sendError)
      }
    }

    source.connect(processor)
    // A ScriptProcessorNode must be connected to run in all supported browsers.
    processor.connect(audioContext.destination)
  }, [])

  const connectRealtime = useCallback(async (apiKey: string): Promise<boolean> => {
    if (!apiKey) {
      setError('A Gemini API key is required.')
      return false
    }

    if (isRealtimeConnected || isRealtimeConnecting) return true

    setIsRealtimeConnecting(true)
    setError(null)

    try {
      const ai = new GoogleGenAI({ apiKey })
      let rejectConnect: ((error: Error) => void) | null = null
      let setupComplete = false

      const abortConnect = new Promise<never>((_, reject) => {
        rejectConnect = reject
      })

      const timeoutConnect = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timed out. Verify your Gemini API key and try again.'))
        }, CONNECT_TIMEOUT_MS)
      })

      const session = await Promise.race([
        ai.live.connect({
        model: LIVE_MODEL,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          // The native-audio Live model only supports audio responses. Text
          // responses are not a valid modality for this model and cause the
          // websocket setup to be rejected.
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: false,
              silenceDurationMs: 700,
            },
          },
          tools: [
            {
              functionDeclarations: [
                {
                  name: 'draw_item',
                  description: 'Draw an item on the canvas. Coordinates are in pixels from top-left. Canvas is roughly 1500x600.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      item_type: {
                        type: Type.STRING,
                        enum: ['database', 'person', 'server', 'gpt_5', 'frontend', 'gpt_realtime'],
                      },
                      x: { type: Type.NUMBER, description: 'X coordinate in pixels' },
                      y: { type: Type.NUMBER, description: 'Y coordinate in pixels' },
                    },
                    required: ['item_type', 'x', 'y'],
                  },
                },
                {
                  name: 'connect',
                  description: 'Connect two items by their UUIDs with an arrow. Use direction to control arrow flow: one_way creates a single directional arrow from item1 to item2 (default), two_way creates a bidirectional arrow between the items.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      item1_uuid: { type: Type.STRING },
                      item2_uuid: { type: Type.STRING },
                      direction: { type: Type.STRING, enum: ['one_way', 'two_way'] },
                    },
                    required: ['item1_uuid', 'item2_uuid'],
                  },
                },
                {
                  name: 'delete_item',
                  description: 'Delete an item by its UUID.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      item_uuid: { type: Type.STRING },
                    },
                    required: ['item_uuid'],
                  },
                },
                {
                  name: 'add_text',
                  description: 'Add text to the whiteboard. Coordinates are in pixels from top-left. Canvas is roughly 1500x800.',
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      x: { type: Type.NUMBER, description: 'X coordinate in pixels' },
                      y: { type: Type.NUMBER, description: 'Y coordinate in pixels' },
                    },
                    required: ['text', 'x', 'y'],
                  },
                },
              ],
            },
          ],
          temperature: 0.3,
        },
        callbacks: {
          onmessage: (message: any) => {
            const transcript = message?.serverContent?.inputTranscription?.text
            if (transcript) {
              console.debug('Gemini heard:', transcript)
            }
            const functionCalls: ToolCallLike[] = message?.toolCall?.functionCalls || []
            if (!functionCalls.length) return

            console.debug('Gemini Live tool calls:', functionCalls)

            ;(async () => {
              try {
                const functionResponses = await Promise.all(
                  functionCalls.map(async (call) => ({
                    id: call.id,
                    name: call.name,
                    response: {
                      result: await executeToolCall(call),
                    },
                  }))
                )
                session.sendToolResponse({ functionResponses })
              } catch (toolError: any) {
                console.error('Tool execution failed:', toolError)
              }
            })()
          },
          onerror: (event: ErrorEvent) => {
            const message = event?.message || 'Realtime connection error'
            if (!setupComplete) {
              rejectConnect?.(new Error(message))
            }
            setError(`Connection failed: ${message}`)
          },
          onclose: (event?: CloseEvent) => {
            const reason = event?.reason?.trim()
            // The server can close a session at any time. Clear the reference
            // here so a later UI cleanup does not try to send to this closed
            // websocket.
            if (sessionRef.current === session) {
              sessionRef.current = null
            }
            if (!setupComplete) {
              rejectConnect?.(new Error(reason || 'Connection closed before setup completed'))
            } else if (reason) {
              setError(`Connection failed: ${reason}`)
            }
            setIsRealtimeConnected(false)
            setIsRealtimeConnecting(false)
          },
        },
      }),
        abortConnect,
        timeoutConnect,
      ])

      setupComplete = true
      sessionRef.current = session

      await startMicrophoneStream()
      setIsRealtimeConnected(true)
      setIsMuted(false)
      return true
    } catch (e: any) {
      console.error('Realtime connection error:', e)

      setError(`Connection failed: ${e?.message || 'Failed to connect to Gemini Live session'}`)
      setIsRealtimeConnected(false)
      sessionRef.current = null
      audioProcessorRef.current?.disconnect()
      audioProcessorRef.current = null
      audioSourceRef.current?.disconnect()
      audioSourceRef.current = null
      void audioContextRef.current?.close()
      audioContextRef.current = null
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      mediaStreamRef.current = null
      return false
    } finally {
      setIsRealtimeConnecting(false)
    }
  }, [SYSTEM_PROMPT, executeToolCall, isRealtimeConnected, isRealtimeConnecting, startMicrophoneStream])

  const disconnectRealtime = useCallback(() => {
    // Clear the reference before stopping local resources. This makes this
    // method idempotent when it is called after Gemini has already closed the
    // websocket (or when React invokes cleanup more than once).
    const liveSession = sessionRef.current
    sessionRef.current = null

    try {
      audioProcessorRef.current?.disconnect()
      audioProcessorRef.current = null
      audioSourceRef.current?.disconnect()
      audioSourceRef.current = null
      void audioContextRef.current?.close()
      audioContextRef.current = null

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      mediaStreamRef.current = null

      // close() ends the stream. Sending audioStreamEnd first can race the
      // remote close and causes the SDK's "CLOSING or CLOSED" warning.
      liveSession?.close?.()
    } catch {
      // noop
    }
    setIsRealtimeConnected(false)
    setIsRealtimeConnecting(false)
    setIsMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    if (!mediaStreamRef.current) return
    const newMutedState = !isMuted
    mediaStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !newMutedState
    })
    setIsMuted(Boolean(newMutedState))
  }, [isMuted])

  const setEditor = useCallback((editor: any) => {
    editorRef.current = editor
  }, [])

  return {
    isRealtimeConnected,
    isRealtimeConnecting,
    isMuted,
    error,
    connectRealtime,
    disconnectRealtime,
    toggleMute,
    setEditor
  }
}


