export type NodeType = 'company' | 'beneficiary'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  val: number
  city?: string
  region?: string
  // company
  sector?: string
  // beneficiary
  profession?: string
  category?: string
  total?: number
  flagged?: boolean
  flag_reason?: string
}

export interface GraphLink {
  source: string
  target: string
  amount: number
  declarations: number
  type: 'remuneration' | 'convention' | 'avantage'
  color: string
  first: string
  last: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export interface Filters {
  linkTypes: Set<string>
  region: string
  minAmount: number
  profession: string
  flaggedOnly: boolean
}
