import {
  DynamicType,
  DynamicTypeKind,
  MetaPromptType,
  Hook,
} from "../../types";

export const defaultDynamic: DynamicType = {
  name: "",
  kind: "chainOfThought",
  metaPrompts: [],
  dynamics: [],
  run: async function (this, previousResult) {
    if (this.beforeExecute) await this.beforeExecute(this.params);
    console.log(`Starting Dynamic: ${this.kind}`);

    let result: any = this.params; // Initialize result with incoming params
    switch (this.kind) {
      case "recursive":
        result = await runRecursive(this, previousResult);
        break;
      case "chainOfThought":
        result = await runChainOfThought(this, previousResult);
        break;
      case "treeOfThought":
        result = await runTreeOfThought(this);
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
  shouldContinue: false,
};

export function createDynamic({
  name,
  kind,
  metaPrompts,
  beforeExecute,
  afterExecute,
  params = {},
  dynamics = [],
}: {
  name: string;
  kind: DynamicTypeKind;
  metaPrompts: MetaPromptType[];
  beforeExecute?: Hook;
  afterExecute?: Hook;
  params?: any;
  dynamics?: DynamicType[];
}): DynamicType {
  return {
    ...defaultDynamic,
    name,
    kind,
    metaPrompts,
    dynamics,
    beforeExecute,
    afterExecute,
    params,
  };
}

async function runChainOfThought(dynamic: DynamicType, previousResult: any) {
  console.log("Running Chain of Thought Dynamic");

  // Ensure dynamic.params is initialized correctly
  dynamic.params = { ...dynamic.params, ...previousResult };

  let result = {};

  // Process metaprompts first, ensuring they can affect dynamic's params
  for (const metaPrompt of dynamic.metaPrompts) {
    const output = await metaPrompt.run(dynamic, dynamic.params);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      dynamic.params = { ...dynamic.params, ...output };
    }
  }

  // Process sub-dynamics with updated params
  if (dynamic.dynamics) {
    for (const subDynamic of dynamic.dynamics) {
      const output = await subDynamic.run(dynamic.params);
      if (typeof output === "object" && output !== null) {
        result = { ...result, ...output };
        dynamic.params = { ...dynamic.params, ...output };
      }
    }
  }

  return result;
}

async function runRecursive(dynamic: DynamicType, previousResult: any) {
  console.log("Running Recursive Dynamic");

  dynamic.params = { ...dynamic.params, ...previousResult };

  let result = {};

  const items = [...dynamic.metaPrompts, ...(dynamic.dynamics || [])];

  for (const item of items) {
    const output = await item.run(dynamic, result);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      dynamic.params = { ...dynamic.params, ...output };
    }
  }

  return result;
}

async function runTreeOfThought(dynamic: DynamicType) {
  console.log("Running Tree of Thought Dynamic");

  const results = await Promise.all(
    dynamic.metaPrompts.map((metaPrompt) =>
      metaPrompt.run(dynamic, dynamic.params),
    ),
  );

  const combinedResults: Record<string, string> = {};
  results.forEach((result) => {
    if (typeof result === "string") {
      combinedResults["combinedString"] =
        (combinedResults["combinedString"] || "") + result;
    } else if (typeof result === "object" && result !== null) {
      Object.assign(combinedResults, result);
    }
  });

  return combinedResults;
}
