import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkflowDto } from './dto/workflow.dto';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workflow } from 'src/schemas/workflow.schema';
import mongoose, { Model } from 'mongoose';
import { AgentService } from './agent/agent.service';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<Workflow>,
    private readonly agentService: AgentService,
  ) {}
  //Ritorna tutti i workflow. Nel poc ritorna tutti i documenti-workflow, con tutte le informazioni.
  //Nella versione finale forse sarebbe meglio mettere solo id e titolo e il fronend la invoca solo quando è nel menù per risparmiare banda (anche se è in locale vabb).
  //Per questo compito è stato creato il workflows-list.dto
  async findAll(): Promise<Workflow[]> {
    return this.workflowModel.find().exec();
  }

  async findOne(id: string): Promise<Workflow> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const workflowFound = await this.workflowModel
        .findOne({ _id: new mongoose.Types.ObjectId(id) })
        .exec();
      if (!workflowFound) {
        throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
      }
      return workflowFound;
    } else throw new HttpException('Id is not valid', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, updateWorkflowDto: WorkflowDto): Promise<Workflow> {
    const updatedWorkflow = await this.workflowModel
      .findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        updateWorkflowDto,
        { new: true },
      )
      .exec();
    if (!updatedWorkflow)
      throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
    return updatedWorkflow;
  }

  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const createdWorkflow = await this.workflowModel.create(createWorkflowDto);
    return createdWorkflow.save();
  }

  async delete(id: string): Promise<Workflow> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const deletedWorkflow = await this.workflowModel
        .findByIdAndDelete({ _id: new mongoose.Types.ObjectId(id) })
        .exec();
      if (!deletedWorkflow) {
        throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
      }
      return deletedWorkflow;
    } else throw new HttpException('Id is not valid', HttpStatus.BAD_REQUEST);
  }

  async execute(id: string): Promise<Record<string, any>> {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const workflowFound = await this.workflowModel
        .findOne({ _id: new mongoose.Types.ObjectId(id) })
        .exec();
      if (!workflowFound) {
        throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
      }
      //return { a: 'a' };
      return this.agentService.execute(workflowFound); //!Esecuzione del workflow
    } else throw new HttpException('Id is not valid', HttpStatus.BAD_REQUEST);
  }
}
