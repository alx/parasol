import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Graph } from '../components/Graph'
import { Sidebar } from '../components/Sidebar'
import { useGraphData } from '../useGraphData'
import { useFilters } from '../useFilters'
import type { GraphNode } from '../types'

export function GraphPage() {
  const { nodeId } = useParams<{ nodeId?: string }>()
  const navigate = useNavigate()
  const { data, error } = useGraphData()
  const {
    filters, setFilters, toggleLinkType,
    search, setSearch,
    filtered,
    regions, professions, maxAmount,
  } = useFilters(data)

  const [manualSelection, setManualSelection] = useState<string | null>(null)
  const selectedId = manualSelection ?? nodeId ?? null

  const nodeById = useMemo(
    () => new Map((data?.nodes ?? []).map(n => [n.id, n])),
    [data]
  )

  function handleSelectNode(node: GraphNode) {
    setManualSelection(node.id)
    navigate(`/node/${node.id}`, { replace: true })
  }

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-400 text-sm">
      Erreur de chargement: {error}
      <br />Assurez-vous que <code>public/graph.json</code> existe.
    </div>
  )

  if (!data) return (
    <div className="flex items-center justify-center h-screen text-gray-500 text-sm">
      Chargement du graphe…
    </div>
  )

  const selectedNode = selectedId ? (nodeById.get(selectedId) ?? null) : null

  return (
    <div className="flex h-screen overflow-hidden">
      <Graph
        nodes={filtered.nodes}
        links={filtered.links}
        selectedId={selectedId}
        onSelectNode={handleSelectNode}
      />
      <Sidebar
        selectedNode={selectedNode}
        allLinks={filtered.links}
        nodeById={nodeById}
        filters={filters}
        regions={regions}
        professions={professions}
        maxAmount={maxAmount}
        search={search}
        onSearch={setSearch}
        onToggleLinkType={toggleLinkType}
        onSetFilters={setFilters}
        totalNodes={data.nodes.length}
        visibleNodes={filtered.nodes.length}
      />
    </div>
  )
}
