export class WorkflowDto {
  id: number;
  flow: Block[];
}

class Block {
  service: 'gmail' | 'docs';
  action: string;
}
