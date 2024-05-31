import Mustache from "mustache";
import { PromptType, AIModel, Hook, PromptObject } from "../../types";
import { ask } from "../../adapters";

export const defaultPrompt: PromptType = {
  name: "defaultPrompt",
  content: "Default analysis",
  context: {},
  model: "LLAMA3",
  run: async function (dynamic, previousResult = {}) {
    if (this.beforeLife) await this.beforeLife(dynamic.context, dynamic);

    const data = {
      ...dynamic.context,
      ...previousResult,
    };

    const interpolatedContent = Mustache.render(this.content as string, data);

    console.log(`Executing Prompt: ${this.name}`);

    // console.log({ context: this.context });

    let aiResponse = (await ask(interpolatedContent, this.model)) as string;

    if (this.afterDeath) await this.afterDeath(dynamic.context, dynamic);

    return { [this.name]: aiResponse };
  },
  beforeLife: () => console.log("Preparing Prompt..."),
  afterDeath: () => console.log("Prompt completed."),
};

export function createPrompt({
  name,
  content,
  context = {},
  model = "LLAMA3",
  beforeLife,
  afterDeath,
}: {
  name: string;
  content: string | PromptObject;
  context: object;
  params?: Record<string, any>;
  model?: AIModel;
  beforeLife?: Hook;
  afterDeath?: Hook;
}): PromptType {
  return {
    ...defaultPrompt,
    name,
    content,
    context,
    model,
    beforeLife,
    afterDeath,
  };
}
