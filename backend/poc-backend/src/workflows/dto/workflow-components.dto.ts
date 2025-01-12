export class Node {
  readonly id: number;
  readonly service: 'gmail' | 'pastebin' | 'calendar';
}

export class Edge {
  readonly fromNodeId: number;
  readonly toNodeId: number;
  readonly action: string;
}
