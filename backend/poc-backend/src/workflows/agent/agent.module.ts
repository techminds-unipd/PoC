import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow, WorkflowSchema } from 'src/schemas/workflow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workflow.name, schema: WorkflowSchema },
    ]),
  ],
  controllers: [],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
