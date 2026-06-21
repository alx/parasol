import { useState, useMemo } from 'react'
import type { GraphData, Filters } from './types'

const DEFAULT_FILTERS: Filters = {
  linkTypes: new Set(['remuneration', 'convention', 'avantage']),
  region: '',
  minAmount: 0,
  profession: '',
  flaggedOnly: false,
}

export function useFilters(data: GraphData | null) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return { nodes: [], links: [] }

    const nodeById = new Map(data.nodes.map(n => [n.id, n]))

    const links = data.links.filter(l => {
      if (!filters.linkTypes.has(l.type)) return false
      if (l.amount < filters.minAmount) return false
      const target = nodeById.get(l.target)
      if (!target) return false
      if (filters.region && target.region !== filters.region) return false
      if (filters.profession && target.profession !== filters.profession) return false
      if (filters.flaggedOnly && !target.flagged) return false
      return true
    })

    const activeIds = new Set(links.flatMap(l => [l.source, l.target]))

    const q = search.toLowerCase().trim()
    const nodes = data.nodes.filter(n => {
      if (!activeIds.has(n.id)) return false
      if (q && !n.label.toLowerCase().includes(q)) return false
      return true
    })

    return { nodes, links }
  }, [data, filters, search])

  // Derived filter options from full dataset
  const regions = useMemo(() =>
    data ? [...new Set(data.nodes.map(n => n.region).filter(Boolean))].sort() as string[] : []
  , [data])

  const professions = useMemo(() =>
    data ? [...new Set(data.nodes.map(n => n.profession).filter(Boolean))].sort() as string[] : []
  , [data])

  const maxAmount = useMemo(() =>
    data ? Math.max(...data.links.map(l => l.amount)) : 0
  , [data])

  function toggleLinkType(type: string) {
    setFilters(f => {
      const next = new Set(f.linkTypes)
      next.has(type) ? next.delete(type) : next.add(type)
      return { ...f, linkTypes: next }
    })
  }

  return {
    filters, setFilters, toggleLinkType,
    search, setSearch,
    filtered,
    regions, professions, maxAmount,
  }
}
