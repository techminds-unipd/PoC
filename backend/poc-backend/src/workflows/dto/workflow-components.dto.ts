export class Node {
  readonly id: number;
  readonly service: 'gmail' | 'docs';
}

export class Edge {
  readonly fromNodeId: number;
  readonly toNodeId: number;
  readonly action: string;
}
