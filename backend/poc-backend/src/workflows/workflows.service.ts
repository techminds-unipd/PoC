import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkflowDto } from './dto/workflow.dto';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workflow } from 'src/schemas/workflow.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<Workflow>,
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
        .findOne({ _id: id })
        .exec();
      if (!workflowFound) {
        throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
      }
      return workflowFound;
    } else throw new HttpException('Id is not valid', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, updateWorkflowDto: WorkflowDto): Promise<Workflow> {
    const updatedWorkflow = await this.workflowModel
      .findByIdAndUpdate({ _id: id }, updateWorkflowDto, { new: true })
      .exec();
    if (!updatedWorkflow)
      throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
    return updatedWorkflow;
  }

  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const createdWorkflow = await this.workflowModel.create(createWorkflowDto);
    return createdWorkflow.save();
  }
}
