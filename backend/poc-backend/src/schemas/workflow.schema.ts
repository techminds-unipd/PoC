import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Node, Edge } from 'src/workflows/dto/workflow-components.dto';

export type WorkflowDocument = HydratedDocument<Workflow>;
//Schema di come sarà salvato un documento su mongodb. viene creata una collezione chiamata come la
//classe ma con una s aggiunta alla fine, in questo caso `workflows`
@Schema()
export class Workflow {
  @Prop({ required: true })
  name: string;

  @Prop([Node])
  nodes: Node[];

  @Prop([Edge])
  edges: Edge[];
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
