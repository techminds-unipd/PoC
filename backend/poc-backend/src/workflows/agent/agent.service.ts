import { Injectable } from '@nestjs/common';
import { WorkflowDocument } from 'src/schemas/workflow.schema';
import { ChatGroq } from '@langchain/groq';
import { StructuredTool } from '@langchain/core/tools';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';
import {
  GmailBaseToolParams,
  GmailCreateDraft,
  GmailGetMessage,
  GmailGetThread,
  GmailSearch,
  GmailSendMessage,
} from '@langchain/community/tools/gmail';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { OpenAI } from '@langchain/openai';

@Injectable()
export class AgentService {
  constructor(private readonly configService: ConfigService) {}

  async execute(workflow: WorkflowDocument): Promise<Record<string, any>> {
    const gmailParams: GmailBaseToolParams = {
      credentials: {
        clientEmail: '',
        privateKey: '',
      },
      scopes: ['https://mail.google.com/'],
    };

    const tools: StructuredTool[] = [
      new GmailGetMessage(gmailParams),
      new GmailCreateDraft(gmailParams),
      new GmailGetThread(gmailParams),
      new GmailSearch(gmailParams),
      new GmailSendMessage(gmailParams),
    ];
    const model = new ChatGroq({
      model: 'llama3-70b-8192',
      temperature: 0,
    });

    const gmailAgent = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'structured-chat-zero-shot-react-description',
      verbose: true,
    });

    const input = 'Read and summarize the latest email.';
    const createResult = await gmailAgent.invoke({ input: input });
    console.log('Create result', createResult);
    return { status: 'executed' };
  }

  async execute_openai(
    workflow: WorkflowDocument,
  ): Promise<Record<string, any>> {
    const model = new OpenAI({
      temperature: 0,
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    const gmailParams: GmailBaseToolParams = {
      credentials: {
        clientEmail: 'techminds.unipd@gmail.com',
        privateKey: '',
        keyfile: './token.json',
      },
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    };

    const tools: StructuredTool[] = [
      new GmailGetMessage(gmailParams),
      new GmailCreateDraft(gmailParams),
      new GmailGetThread(gmailParams),
      new GmailSearch(gmailParams),
      new GmailSendMessage(gmailParams),
    ];

    const gmailAgent = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'structured-chat-zero-shot-react-description',
      verbose: true,
    });
    const input =
      "Riesci a leggere le mail presenti nell'inbox usando le credenziali fornite?";
    const createResult = await gmailAgent.invoke({ input: input });
    console.log('Create result', createResult);

    return { status: 'executed' };
  }
}
