import type { GraphNode, GraphLink, Filters } from '../types'

const LINK_COLORS = {
  remuneration: '#e07b39',
  convention: '#4a90d9',
  avantage: '#5cb85c',
}

function fmt(n: number) {
  return '€' + n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
}

interface NodeDetailProps {
  node: GraphNode
  links: GraphLink[]
  nodeById: Map<string, GraphNode>
}

function NodeDetail({ node, links, nodeById }: NodeDetailProps) {
  const total = links.reduce((s, l) => s + l.amount, 0)
  const isCompany = node.type === 'company'
  const sorted = [...links].sort((a, b) => b.amount - a.amount).slice(0, 25)

  return (
    <div className="p-4 overflow-y-auto flex-1">
      <div className="flex items-start gap-2 mb-3">
        <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${isCompany ? 'bg-blue-400' : 'bg-orange-400'}`} />
        <h2 className="text-[15px] font-semibold text-blue-300 leading-snug break-words">{node.label}</h2>
      </div>

      {node.flagged && (
        <div className="mb-3 px-2 py-1.5 bg-yellow-900/40 border border-yellow-700/50 rounded text-yellow-300 text-xs">
          ⚠ {node.flag_reason}
        </div>
      )}

      <div className="space-y-1.5 text-xs mb-4">
        <Row label="Type" val={isCompany ? 'Entreprise' : (node.profession || node.category || 'Bénéficiaire')} />
        {node.city && <Row label="Ville" val={node.city} />}
        {node.region && <Row label="Région" val={node.region} />}
        {node.sector && <Row label="Secteur" val={node.sector} />}
        <Row label="Total" val={fmt(total)} />
        <Row label="Liens" val={String(links.length)} />
      </div>

      <div className="space-y-2">
        {sorted.map((l, i) => {
          const otherId = isCompany ? l.target : l.source
          const other = nodeById.get(otherId)
          const color = LINK_COLORS[l.type] ?? '#aaa'
          return (
            <div key={i} className="bg-[#0d1117] rounded p-2 text-xs">
              <div className="font-semibold mb-0.5" style={{ color }}>{l.type}</div>
              <div className="text-gray-200 truncate">{other?.label ?? otherId}</div>
              <div className="text-gray-500 mt-0.5">
                {fmt(l.amount)} · {l.declarations} décl. · {l.first} → {l.last}
              </div>
            </div>
          )
        })}
        {links.length > 25 && (
          <p className="text-xs text-gray-500 text-center">+{links.length - 25} autres</p>
        )}
      </div>
    </div>
  )
}

function Row({ label, val }: { label: string; val: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-gray-500">{label}</div>
      <div className="text-gray-200">{val}</div>
    </div>
  )
}

interface FiltersProps {
  filters: Filters
  regions: string[]
  professions: string[]
  maxAmount: number
  search: string
  onSearch: (s: string) => void
  onToggleLinkType: (t: string) => void
  onSetFilters: React.Dispatch<React.SetStateAction<Filters>>
  totalNodes: number
  visibleNodes: number
}

export function SidebarFilters({
  filters, regions, professions, maxAmount,
  search, onSearch, onToggleLinkType, onSetFilters,
  totalNodes, visibleNodes,
}: FiltersProps) {
  return (
    <div className="p-3 border-b border-[#30363d] space-y-3">
      <input
        className="w-full px-2 py-1.5 bg-[#0d1117] border border-[#30363d] rounded text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500"
        placeholder="Rechercher un nom…"
        value={search}
        onChange={e => onSearch(e.target.value)}
      />

      <div className="flex gap-3 text-xs flex-wrap">
        {(['remuneration', 'convention', 'avantage'] as const).map(t => (
          <label key={t} className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.linkTypes.has(t)}
              onChange={() => onToggleLinkType(t)}
              className="hidden"
            />
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: filters.linkTypes.has(t) ? LINK_COLORS[t] : '#444' }}
            />
            <span className={filters.linkTypes.has(t) ? 'text-gray-200' : 'text-gray-600'}>{t}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          className="px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded text-xs text-gray-300 col-span-2"
          value={filters.region}
          onChange={e => onSetFilters(f => ({ ...f, region: e.target.value }))}
        >
          <option value="">Toutes régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select
          className="px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded text-xs text-gray-300 col-span-2"
          value={filters.profession}
          onChange={e => onSetFilters(f => ({ ...f, profession: e.target.value }))}
        >
          <option value="">Toutes professions</option>
          {professions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Montant minimum</span>
          <span>{fmt(filters.minAmount)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxAmount}
          step={Math.max(1, Math.floor(maxAmount / 200))}
          value={filters.minAmount}
          onChange={e => onSetFilters(f => ({ ...f, minAmount: Number(e.target.value) }))}
          className="w-full accent-blue-400"
        />
      </div>

      <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
        <input
          type="checkbox"
          checked={filters.flaggedOnly}
          onChange={e => onSetFilters(f => ({ ...f, flaggedOnly: e.target.checked }))}
        />
        <span className="text-yellow-400">⚠ Nœuds signalés seulement</span>
      </label>

      <div className="text-[10px] text-gray-600">
        {visibleNodes.toLocaleString()} / {totalNodes.toLocaleString()} nœuds visibles
      </div>
    </div>
  )
}

interface SidebarProps extends FiltersProps {
  selectedNode: GraphNode | null
  allLinks: GraphLink[]
  nodeById: Map<string, GraphNode>
}

export function Sidebar({ selectedNode, allLinks, nodeById, ...filterProps }: SidebarProps) {
  const nodeLinks = selectedNode
    ? allLinks.filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
    : []

  return (
    <aside className="w-[300px] shrink-0 bg-[#161b22] border-l border-[#30363d] flex flex-col h-screen overflow-hidden">
      <div className="p-3 border-b border-[#30363d]">
        <h1 className="text-sm font-bold text-gray-200 tracking-wide">Parasol</h1>
        <p className="text-[10px] text-gray-600 mt-0.5">Transparence Santé — réseau de paiements</p>
      </div>
      <SidebarFilters {...filterProps} />
      <div className="flex-1 overflow-y-auto">
        {selectedNode
          ? <NodeDetail node={selectedNode} links={nodeLinks} nodeById={nodeById} />
          : <p className="p-4 text-xs text-gray-600">Cliquez sur un nœud pour voir les détails.</p>
        }
      </div>
    </aside>
  )
}
