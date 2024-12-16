import { Injectable } from '@nestjs/common';
import { WorkflowDocument } from 'src/schemas/workflow.schema';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { env } from 'node:process';

@Injectable()
export class AgentService {
  constructor() {}

  async execute(workflow: WorkflowDocument): Promise<Record<string, any>> {
    console.log(env);
    const model = new ChatGroq({
      model: 'llama-3.1-70b-versatile',
      temperature: 0,
    });

    const messages = [
      new SystemMessage(
        'Translate the following sentence from english into italian',
      ),
      new HumanMessage('Hi!'),
    ];

    const result = await model.invoke(messages);
    const parser = new StringOutputParser();
    const message = parser.invoke(result);
    console.log(message);
    return { status: 'executed' };
  }
}
