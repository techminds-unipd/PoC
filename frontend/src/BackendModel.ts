export interface Node {
  readonly id: number;
  readonly service: 'gmail' | 'pastebin';
}

export interface Edge {
  readonly fromNodeId: number;
  readonly toNodeId: number;
  readonly action: string;
}

export interface Workflow {
  _id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}
