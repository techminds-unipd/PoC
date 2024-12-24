import { Module } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow, WorkflowSchema } from 'src/schemas/workflow.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Workflow.name, schema: WorkflowSchema },
        ]),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        HttpModule,
    ],
    controllers: [WorkflowsController],
    providers: [WorkflowsService],
})
export class WorkflowsModule {}
