import { useCallback, useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from '@google/genai'

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

interface UseArchitectureAnalysisState {
  suggestions: ArchitectureSuggestion[]
  isAnalyzing: boolean
  lastAnalysis: Date | null
  error: string | null
  startOrResetAnalysisTimer: () => void
  dismissSuggestion: (id: string) => void
  clearSuggestions: () => void
  setEditor: (editor: any) => void
}

export function useArchitectureAnalysis(apiKey: string): UseArchitectureAnalysisState {
  const [suggestions, setSuggestions] = useState<ArchitectureSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<any>(null)
  const timeoutIdRef = useRef<number | null>(null)
  const intervalIdRef = useRef<number | null>(null)

  const setEditor = useCallback((editor: any) => {
    editorRef.current = editor
  }, [])

  const extractDiagramData = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return null

    try {
      // Get all shapes from the editor
      const shapes = editor.getCurrentPageShapes()
      
      const components: Array<{
        type: string
        id: string
        position: { x: number; y: number }
        size: { w: number; h: number }
        color?: string
      }> = []

      const connections: Array<{
        from: string
        to: string
        id: string
      }> = []

      shapes.forEach((shape: any) => {
        if (shape.type === 'arrow') {
          // Extract connection information
          const fromShape = shapes.find((s: any) => {
            const center = { x: s.x + (s.props?.w || 0) / 2, y: s.y + (s.props?.h || 0) / 2 }
            const startPoint = shape.props?.start
            return startPoint && Math.abs(center.x - startPoint.x) < 50 && Math.abs(center.y - startPoint.y) < 50
          })
          
          const toShape = shapes.find((s: any) => {
            const center = { x: s.x + (s.props?.w || 0) / 2, y: s.y + (s.props?.h || 0) / 2 }
            const endPoint = shape.props?.end
            return endPoint && Math.abs(center.x - endPoint.x) < 50 && Math.abs(center.y - endPoint.y) < 50
          })

          if (fromShape && toShape) {
            connections.push({
              from: fromShape.id,
              to: toShape.id,
              id: shape.id
            })
          }
        } else if (['database', 'user', 'server', 'llm', 'frontend', 'gpt_realtime'].includes(shape.type)) {
          // Extract component information
          components.push({
            type: shape.type,
            id: shape.id,
            position: { x: shape.x, y: shape.y },
            size: { w: shape.props?.w || 0, h: shape.props?.h || 0 },
            color: shape.props?.color
          })
        }
      })

      return { components, connections }
    } catch (e) {
      console.error('Error extracting diagram data:', e)
      return null
    }
  }, [])

  const analyzeDiagram = useCallback(async () => {
    console.log('🔍 analyzeDiagram called with:', { apiKey: apiKey ? apiKey.slice(0, 10) + '...' : 'none', isAnalyzing })
    
    if (!apiKey) {
      console.log('❌ No API key available')
      return
    }
    
    if (isAnalyzing) {
      console.log('⏳ Already analyzing, skipping')
      return
    }

    console.log('✅ Starting diagram analysis...')
    setIsAnalyzing(true)
    setError(null)

    try {
      console.log('📊 Extracting diagram data...')
      const diagramData = extractDiagramData()
      console.log('📊 Diagram data extracted:', diagramData)
      
      if (!diagramData || diagramData.components.length === 0) {
        console.log('📊 No components found, skipping analysis')
        setSuggestions([])
        setLastAnalysis(new Date())
        return
      }

      const prompt = `Analyze this architecture and suggest 1-2 missing components:

Components: ${JSON.stringify(diagramData.components.map(c => ({ 
  type: c.type, 
  id: c.id.split(':')[1] || c.id
})), null, 2)}
Connections: ${JSON.stringify(diagramData.connections.map(c => ({ 
  from: c.from.split(':')[1] || c.from, 
  to: c.to.split(':')[1] || c.to 
})), null, 2)}

Return JSON format:
[
  {
    "title": "Cache",
    "description": "Speed up data access",
    "component_type": "database",
    "reasoning": "Reduce database load",
    "connections": [
      {
        "to_component_id": "existing_id",
        "direction": "to",
        "description": "Caches data from DB"
      }
    ]
  }
]

Keep titles under 15 chars, descriptions under 25 chars, reasoning under 20 chars. Use actual component IDs. Return [] if complete.`

      const ai = new GoogleGenAI({ apiKey })
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      })

      const content = result.text

      if (!content) {
        throw new Error('No response content from Gemini')
      }

      console.log('Content:', content)

      try {
        // Extract JSON from the response (in case there's extra text)
        const cleanContent = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
        const jsonMatch = cleanContent.match(/\[[\s\S]*\]/)
        const jsonStr = jsonMatch ? jsonMatch[0] : cleanContent
        const suggestionsData = JSON.parse(jsonStr)

        // Validate and add IDs to suggestions
        const validSuggestions: ArchitectureSuggestion[] = suggestionsData
          .filter((s: any) => s.title && s.description && s.component_type && s.reasoning)
          .map((s: any) => ({
            ...s,
            id: `suggestion_${Date.now()}_${Math.random().toString(36).slice(2)}`
          }))

        console.log('Valid suggestions:', validSuggestions)

        setSuggestions(validSuggestions)
        setLastAnalysis(new Date())
      } catch (parseError) {
        console.error('Error parsing suggestions:', parseError, 'Content:', content)
        throw new Error('Invalid response format from analysis')
      }

    } catch (e: any) {
      console.error('Architecture analysis error:', e)
      setError(`Analysis failed: ${e.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }, [apiKey, isAnalyzing, extractDiagramData])

  const startOrResetAnalysisTimer = useCallback(() => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
    if (intervalIdRef.current) clearInterval(intervalIdRef.current)

    timeoutIdRef.current = window.setTimeout(() => {
      analyzeDiagram()
      intervalIdRef.current = window.setInterval(analyzeDiagram, 10000)
    }, 10000)
  }, [analyzeDiagram])

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
      if (intervalIdRef.current) clearInterval(intervalIdRef.current)
    }
  }, [])

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id))
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  return {
    suggestions,
    isAnalyzing,
    lastAnalysis,
    error,
    startOrResetAnalysisTimer,
    dismissSuggestion,
    clearSuggestions,
    setEditor
  }
}
