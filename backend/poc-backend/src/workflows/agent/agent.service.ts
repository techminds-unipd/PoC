import { Injectable } from '@nestjs/common';
import { WorkflowDocument } from 'src/schemas/workflow.schema';
import { ChatGroq } from '@langchain/groq';
import { StructuredTool } from '@langchain/core/tools';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';
import {
  GmailBaseToolParams,
  GmailGetMessage,
} from '@langchain/community/tools/gmail';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

@Injectable()
export class AgentService {
  constructor(private readonly configService: ConfigService) {}

  async execute(workflow: WorkflowDocument): Promise<Record<string, any>> {
    console.log(this.configService.get<string>('GMAIL_CLIENT_EMAIL'));
    const gmailParams: GmailBaseToolParams = {
      credentials: {
        keyfile: '../../../google_secret2.json.env',
      },
      scopes: ['https://mail.google.com'],
    };

    const tools: StructuredTool[] = [new GmailGetMessage(gmailParams)];
    const model = new ChatGroq({
      model: 'llama-3.1-70b-versatile',
      temperature: 0,
    });

    const gmailAgent = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'structured-chat-zero-shot-react-description',
      verbose: true,
    });

    const input = "leggi l'ultima mail e fanne un riassunto";
    const createResult = await gmailAgent.invoke({ input: input });
    console.log('Create result', createResult);
    return { status: 'executed' };
  }
}
