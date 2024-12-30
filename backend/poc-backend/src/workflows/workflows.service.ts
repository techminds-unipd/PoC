import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WorkflowDto } from './dto/workflow.dto';
import { CreateWorkflowDto } from './dto/createWorkflow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workflow } from 'src/schemas/workflow.schema';
import { User } from 'src/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(Workflow.name) private readonly workflowModel: Model<Workflow>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

  async execute(id: string) {
    const workflow = await this.workflowModel
      .findOne({ _id: new mongoose.Types.ObjectId(id) })
      .exec();

    if (!workflow)
      throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
    if (workflow.nodes.length === 0)
      throw new HttpException('No nodes', HttpStatus.BAD_REQUEST);
    if (workflow.edges.length === 0)
      throw new HttpException('No edges', HttpStatus.BAD_REQUEST);

    const user = await this.userModel.findOne().exec();

    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const workflowAndData = {
      workflow: {
        name: workflow.name,
        nodes: workflow.nodes,
        edges: workflow.edges,
      },
      googleTokenFile: {
        token: user.token,
        refresh_token: "",
        token_uri: "https://oauth2.googleapis.com/token",
        client_id: this.configService.get('CLIENT_ID'),
        client_secret: this.configService.get('CLIENT_SECRET'),
        scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
        universe_domain: "googleapis.com",
        account: "",
        expiry: user.expiry
      }
    };

    console.log(workflowAndData)

    return this.httpService.post('http://127.0.0.1:5000/execute', workflowAndData).pipe(
      catchError(e => {
        console.log(e);
        throw new HttpException('Cannot connect to the worker', HttpStatus.SERVICE_UNAVAILABLE);
      }),
    );
  }
}
