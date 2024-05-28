import {
  MetaPromptType,
  AIModel,
  DynamicType,
  Hook,
  ContentFunction,
} from "../../types";
import { ask } from "../../adapters";

export const defaultMetaPrompt: MetaPromptType = {
  name: "defaultMetaPrompt",
  content: "Default analysis",
  params: {},
  dynamics: [],
  model: "LLAMA3XXX",
  run: async function (dynamic, previousResult = {}) {
    if (this.beforeExecute) await this.beforeExecute(dynamic.params, dynamic);

    const contentToProcess =
      typeof this.content === "function"
        ? this.content(dynamic.params)
        : this.content;

    let interpolatedContent: string | Record<string, any> = "";

    if (typeof contentToProcess === "string") {
      interpolatedContent = Object.keys(dynamic.params).reduce(
        (acc, key) =>
          acc.replace(
            new RegExp(`{{${key}}}`, "g"),
            dynamic.params[key] || previousResult[key],
          ),
        contentToProcess,
      );
    } else {
      interpolatedContent = contentToProcess;
    }

    // console.log({ request: interpolatedContent });

    console.log(`Executing MetaPrompt: ${this.name}`);

    let aiResponse = (await ask(interpolatedContent, this.model)) as string;

    if (this.afterExecute) await this.afterExecute(dynamic.params, dynamic);

    return { [this.name]: aiResponse };
  },
  beforeExecute: () => console.log("Preparing meta-prompt..."),
  afterExecute: () => console.log("Meta-prompt completed."),
};

export function createMetaPrompt({
  name,
  content,
  params = {},
  dynamics = [],
  model = "LLAMA3XXX",
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
    ...defaultMetaPrompt,
    name,
    content,
    params,
    dynamics,
    model,
    beforeExecute,
    afterExecute,
  };
}
