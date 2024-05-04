import { MetaPromptType, AIModel, DynamicType, Hook } from "../../types";
import { ask } from "../../adapters";

export const defaultMetaPrompt: MetaPromptType = {
  content: "Default analysis",
  params: {},
  dynamics: [],
  model: "nous-hermes-llama2-13b.Q4_0.gguf",
  runMetaPrompt: async function (previousResult?: any) {
    if (this.beforeExecute) await this.beforeExecute.call(this);
    console.log(`Executing MetaPrompt: ${this.content}`);

    let aiResponse = previousResult;
    try {
      aiResponse = await ask(this.content, { model: this.model });
      console.log("AI Response:", aiResponse);
    } catch (error) {
      console.error("Error during AI interaction:", error);
    }

    if (this.afterExecute) await this.afterExecute.call(this);

    return aiResponse;
  },
  beforeExecute: () => console.log("Preparing meta-prompt..."),
  afterExecute: () => console.log("Meta-prompt completed."),
};

export function createMetaPrompt({
  content,
  params = {},
  dynamics = [],
  model = "nous-hermes-llama2-13b.Q4_0.gguf",
  beforeExecute,
  afterExecute,
}: {
  content: string;
  params?: Record<string, any>;
  dynamics?: DynamicType[];
  model?: AIModel;
  beforeExecute?: Hook;
  afterExecute?: Hook;
}): MetaPromptType {
  return {
    ...defaultMetaPrompt,
    content,
    params,
    dynamics,
    model,
    beforeExecute,
    afterExecute,
  };
}
