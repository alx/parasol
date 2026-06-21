import { useRef, useCallback, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { GraphNode, GraphLink } from '../types'

interface Props {
  nodes: GraphNode[]
  links: GraphLink[]
  selectedId: string | null
  onSelectNode: (node: GraphNode) => void
}

export function Graph({ nodes, links, selectedId, onSelectNode }: Props) {
  const fgRef = useRef<any>(null)

  const nodeColor = useCallback((node: GraphNode) => {
    if (node.id === selectedId) return '#ffffff'
    if (node.flagged) return '#fbbf24'
    return node.type === 'company' ? '#58a6ff' : '#f0883e'
  }, [selectedId])

  const linkColor = useCallback((link: GraphLink) => {
    return (link.color ?? '#555') + '99'
  }, [])

  const linkWidth = useCallback((link: GraphLink) => {
    return Math.max(0.5, Math.log10((link.amount ?? 1) + 1) * 0.3)
  }, [])

  // Center on selected node when it changes
  useEffect(() => {
    if (!selectedId || !fgRef.current) return
    const node = nodes.find(n => n.id === selectedId)
    if (node && (node as any).x != null) {
      fgRef.current.centerAt((node as any).x, (node as any).y, 600)
      fgRef.current.zoom(3, 600)
    }
  }, [selectedId, nodes])

  return (
    <div className="flex-1 bg-[#0d1117]">
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes: nodes as any[], links: links as any[] }}
        nodeId="id"
        nodeLabel="label"
        nodeVal="val"
        nodeColor={nodeColor as any}
        linkColor={linkColor as any}
        linkWidth={linkWidth as any}
        onNodeClick={(node: any) => onSelectNode(node as GraphNode)}
        backgroundColor="#0d1117"
        nodeRelSize={4}
        linkDirectionalParticles={0}
      />
    </div>
  )
}
