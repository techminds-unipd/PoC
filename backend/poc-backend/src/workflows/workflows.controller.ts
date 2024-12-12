import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowDto } from './workflow.dto';
import { NewWorkflowDto } from './new-workflow.dto';
import { WorkflowsListDto } from './workflows-list.dto';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  //Restituisce un array con gli id dei workflow disponibili
  @Get()
  getWorkflows(): Promise<WorkflowsListDto> {
    return this.workflowsService.getWorkflows();
  }

  //READ
  //Restituisce il JSON che descrive il workflow se esiste, altrimenti 404
  @Get('/:workflowId')
  getSelectedWorkflow(
    @Param('workflowId', ParseIntPipe) workflowId: number,
  ): Promise<WorkflowDto> {
    return this.workflowsService.getSelectedWorkflow(workflowId);
  }

  //UPDATE
  //Aggorna il workflow
  @Put('/:workflowId')
  updateWorkflow(
    @Param('workflowId', ParseIntPipe) workflowId: number,
    @Body() updatedWorkflow: WorkflowDto,
  ): Promise<WorkflowDto> {
    return this.workflowsService.updateWorkflow(workflowId, updatedWorkflow);
  }

  //CREATE
  @Post('/new')
  createWorkflow(@Body() newWorkflow: NewWorkflowDto): Promise<WorkflowDto> {
    return this.workflowsService.createWorkflow(newWorkflow);
  }
}
