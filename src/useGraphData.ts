import { useState, useEffect } from 'react'
import type { GraphData } from './types'

export function useGraphData() {
  const [data, setData] = useState<GraphData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('./graph.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  return { data, error }
}
