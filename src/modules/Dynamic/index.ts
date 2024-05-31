import {
  DynamicType,
  DynamicTypeKind,
  MetaPromptType,
  Hook,
} from "../../types";
import { createPrompt } from "../Prompt";

export const defaultDynamic: DynamicType = {
  name: "",
  kind: "chainOfThought",
  // @ts-ignore
  prompts: [],
  dynamics: [],
  run: async function (this, previousResult) {
    if (this.beforeExecute) await this.beforeExecute(this.params);
    console.log(`Starting Dynamic: ${this.kind}`);

    let result: any = this.params;
    switch (this.kind) {
      case "chainOfThought":
        result = await runChainOfThought(this, previousResult);
        break;
      case "treeOfThought":
        result = await runTreeOfThought(this, previousResult);
        break;
      default:
        console.error("Unknown dynamic type");
        return {};
    }

    if (this.afterExecute) await this.afterExecute(result);
    return { [this.name]: result };
  },
  beforeExecute: () => console.log("Preparing dynamic..."),
  afterExecute: () => console.log("Dynamic completed."),
};

export function createDynamic(params: {
  name: string;
  kind: DynamicTypeKind;
  prompts: MetaPromptType[];
  beforeExecute?: Hook;
  afterExecute?: Hook;
  params?: any;
  dynamics?: DynamicType[];
}): DynamicType {
  // @ts-ignore
  return {
    ...defaultDynamic,
    ...params,
  };
}

async function runChainOfThought(dynamic: DynamicType, previousResult: any) {
  console.log(`Running ${dynamic.name} Dynamic`);

  dynamic.params = { ...dynamic.params, ...previousResult };

  let result = {};

  // @ts-ignore
  for (const prompt of dynamic.prompts) {
    const name = Object.keys(prompt)[0];
    const content = Object.values(prompt)[0];
    const newPrompt = createPrompt({ name, content: content as string });
    const output = await newPrompt.run(dynamic, dynamic.params);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      dynamic.params = { ...dynamic.params, ...output };
    }
  }

  for (const subDynamic of dynamic.dynamics || []) {
    const output = await subDynamic.run(dynamic.params);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      dynamic.params = { ...dynamic.params, ...output };
    }
  }

  return result;
}

async function runTreeOfThought(dynamic: DynamicType, previousResult: any) {
  console.log(`Running ${dynamic.name} Tree of Thought Dynamic`);

  dynamic.params = { ...dynamic.params, ...previousResult };

  // Process all prompts first and update results and params
  const promptResults = await Promise.all(
    // @ts-ignore
    dynamic.prompts.map((prompt) => {
      const name = Object.keys(prompt)[0];
      const content = Object.values(prompt)[0];
      return createPrompt({ name, content: content as string }).run(
        dynamic,
        dynamic.params,
      );
    }),
  );

  // Update params with results from prompts
  // @ts-ignore
  promptResults.forEach((result) => {
    if (typeof result === "object" && result !== null) {
      dynamic.params = { ...dynamic.params, ...result };
    }
  });

  // Process all dynamics with updated params
  const dynamicResults = await Promise.all(
    // @ts-ignore
    dynamic.dynamics.map((subDynamic) => subDynamic.run(dynamic.params)),
  );

  // Combine results from both prompts and dynamics
  const combinedResults: Record<string, string> = {};
  [...promptResults, ...dynamicResults].forEach((result) => {
    if (typeof result === "string") {
      combinedResults["combinedString"] =
        (combinedResults["combinedString"] || "") + result;
    } else if (typeof result === "object" && result !== null) {
      Object.assign(combinedResults, result);
    }
  });

  return combinedResults;
}
