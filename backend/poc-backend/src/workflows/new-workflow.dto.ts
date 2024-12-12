export class NewWorkflowDto {
  flow: Block[];
}

class Block {
  service: 'gmail' | 'docs';
  action: string;
}
