import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowDto } from './dto/workflow.dto';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';
import { Workflow } from 'src/schemas/workflow.schema';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  //Restituisce un array con gli id dei workflow disponibili
  @Get()
  async findAll(): Promise<Workflow[]> {
    return this.workflowsService.findAll();
  }

  //READ
  //Restituisce il JSON che descrive il workflow se esiste, altrimenti 404
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Workflow> {
    return this.workflowsService.findOne(id);
  }

  //UPDATE
  //Aggorna il workflow
  @Put('/:id')
  async update(@Param('id') id: string, @Body() updatedWorkflow: WorkflowDto) {
    return this.workflowsService.update(id, updatedWorkflow);
  }

  //CREATE
  @Post('/new')
  async createWorkflow(@Body() newWorkflowDto: CreateWorkflowDto) {
    return this.workflowsService.create(newWorkflowDto);
  }
}
