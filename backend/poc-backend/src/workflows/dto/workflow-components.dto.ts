export class Node {
  readonly id: number;
  readonly service: 'gmail' | 'docs';
}

export class Edge {
  readonly id: number;
  readonly action: string;
}
