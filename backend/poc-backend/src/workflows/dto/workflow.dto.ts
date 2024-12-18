import { Node, Edge } from './workflow-components.dto';
/*Questa è la struttura dati salvata nel backend.
  È possibile che sia presente un dto in formato non consistente es. solo archi o solo nodi.
*/
export class WorkflowDto {
  readonly _id: number; //? Penso che questo sia da togliere
  readonly name: string;
  readonly nodes: Node[];
  readonly edges: Edge[];
}
