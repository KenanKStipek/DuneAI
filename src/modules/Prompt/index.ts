import Mustache from "mustache";
import {
  MetaPromptType,
  AIModel,
  DynamicType,
  Hook,
  ContentFunction,
} from "../../types";
import { ask } from "../../adapters";

export const defaultPrompt: MetaPromptType = {
  name: "defaultPrompt",
  content: "Default analysis",
  params: {},
  dynamics: [],
  model: "LLAMA3",
  run: async function (dynamic, previousResult = {}) {
    if (this.beforeExecute) await this.beforeExecute(dynamic.params, dynamic);

    const data = {
      ...dynamic.params,
      ...previousResult,
    };

    const interpolatedContent = Mustache.render(this.content as string, data);

    console.log({ interpolatedContent });

    console.log(`Executing Prompt: ${this.name}`);

    let aiResponse = (await ask(interpolatedContent, this.model)) as string;

    if (this.afterExecute) await this.afterExecute(dynamic.params, dynamic);

    return { [this.name]: aiResponse };
  },
  beforeExecute: () => console.log("Preparing meta-prompt..."),
  afterExecute: () => console.log("Meta-prompt completed."),
};

export function createPrompt({
  name,
  content,
  params = {},
  dynamics = [],
  model = "LLAMA3",
  beforeExecute,
  afterExecute,
}: {
  name: string;
  content: string | ContentFunction;
  params?: Record<string, any>;
  dynamics?: DynamicType[];
  model?: AIModel;
  beforeExecute?: Hook;
  afterExecute?: Hook;
}): MetaPromptType {
  return {
    ...defaultPrompt,
    name,
    content,
    params,
    dynamics,
    model,
    beforeExecute,
    afterExecute,
  };
}
