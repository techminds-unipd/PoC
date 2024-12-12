import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkflowsListDto } from './workflows-list.dto';
import { WorkflowDto } from './workflow.dto';
import { NewWorkflowDto } from './new-workflow.dto';

@Injectable()
export class WorkflowsService {
  //Ritorna tutti i workflow
  async getWorkflows(): Promise<WorkflowsListDto> {
    //!Prende la lista dei workflow da mongodb
    return {
      workflows: [
        {
          id: 1,
          flow: [{ service: 'gmail', action: 'Read all mails' }],
        },
      ],
    };
  }

  async getSelectedWorkflow(workflowId: number): Promise<WorkflowDto> {
    console.log('Cercato workflow ' + workflowId);
    if (workflowId !== 1)
      throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
    return {
      id: 1,
      flow: [
        {
          service: 'docs',
          action:
            "leggi quello che c'è scritto e manda una mail a tutte le persone menzionate",
        },
        { service: 'gmail', action: '' },
      ],
    };
  }

  async updateWorkflow(
    workflowId: number,
    updatedWorkflow: WorkflowDto,
  ): Promise<WorkflowDto> {
    return {
      id: 1,
      flow: [
        {
          service: 'docs',
          action:
            "AGGIORNATOOleggi quello che c'è scritto e manda una mail a tutte le persone menzionate",
        },
        { service: 'gmail', action: '' },
      ],
    };
  }

  async createWorkflow(newWorkflow: NewWorkflowDto): Promise<WorkflowDto> {
    return {
      id: 1,
      flow: [
        {
          service: 'docs',
          action:
            "CREATOOOleggi quello che c'è scritto e manda una mail a tutte le persone menzionate",
        },
        { service: 'gmail', action: '' },
      ],
    };
  }
}
