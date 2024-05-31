import {
  DynamicType,
  DynamicTypeKind,
  PromptType,
  Hook,
  PromptInstruction,
} from "../../types";
import { createPrompt } from "../Prompt";

export const defaultDynamic: DynamicType = {
  name: "defaultDynamic",
  kind: "chainOfThought",
  prompts: [],
  dynamics: [],
  context: {},
  run: async function (this, previousResult) {
    if (this.beforeLife) await this.beforeLife(this.context);
    console.log(`Starting Dynamic: ${this.kind}`);

    let result: any = this.context;
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

    if (this.afterDeath) await this.afterDeath(result);
    return { [this.name]: result };
  },
  beforeLife: () => console.log("Preparing dynamic..."),
  afterDeath: () => console.log("Dynamic completed."),
};
export function createDynamic(context: {
  name: string;
  kind: DynamicTypeKind;
  prompts: (PromptType | PromptInstruction)[];
  beforeLife?: Hook;
  afterDeath?: Hook;
  params?: any;
  dynamics?: DynamicType[];
  context?: object;
}): any {
  return {
    ...defaultDynamic,
    ...context,
  };
}

async function runChainOfThought(dynamic: DynamicType, previousResult: any) {
  console.log(`Running ${dynamic.name} Dynamic`);

  dynamic.context = { ...dynamic.context, ...previousResult.context };

  console.log("runChainOfThought");
  console.log({ context: dynamic.context });

  let result = {};

  for (const prompt of dynamic.prompts) {
    const name = Object.keys(prompt)[0];
    const content = Object.values(prompt)[0];
    const newPrompt = createPrompt({
      name,
      content: content as string,
      context: dynamic.context,
    });
    const output = await newPrompt.run(dynamic, dynamic.context);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      dynamic.context = { ...dynamic.context, ...output };
    }
  }

  for (const subDynamic of dynamic.dynamics || []) {
    const output = await subDynamic.run(dynamic.context);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      dynamic.context = { ...dynamic.context, ...output };
    }
  }

  return result;
}

async function runTreeOfThought(dynamic: DynamicType, previousResult: any) {
  console.log(`Running ${dynamic.name} Tree of Thought Dynamic`);

  dynamic.context = { ...dynamic.context, ...previousResult };

  // Process all prompts first and update results and params
  const promptResults = await Promise.all(
    dynamic.prompts.map((prompt) => {
      const name = Object.keys(prompt)[0];
      const content = Object.values(prompt)[0];
      return createPrompt({
        name,
        content: content as string,
        context: dynamic.context,
      }).run(dynamic, dynamic.context);
    }),
  );

  // Update params with results from prompts
  promptResults.forEach((result) => {
    if (typeof result === "object" && result !== null) {
      dynamic.context = { ...dynamic.context, ...result };
    }
  });

  // Process all dynamics with updated params
  const dynamicResults = await Promise.all(
    // @ts-ignore
    dynamic.dynamics.map((subDynamic) => subDynamic.run(dynamic.context)),
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
