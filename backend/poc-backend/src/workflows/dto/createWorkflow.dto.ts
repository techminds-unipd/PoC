import { Node, Edge } from './workflow-components.dto';

//Questo è il workflow mandato dal frontend, quindi privo di id
export class CreateWorkflowDto {
  readonly name: string;
  readonly nodes: Node[];
  readonly edges: Edge[];
}
