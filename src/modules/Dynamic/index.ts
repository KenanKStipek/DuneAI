import {
  DynamicType,
  PrimeDynamicType,
  DynamicTypeKind,
  MetaPromptType,
  Hook,
} from "../../types";

export const defaultDynamic: DynamicType = {
  kind: "chainOfThought",
  metaPrompts: [],
  run: async function () {
    if (this.beforeExecute) await this.beforeExecute.call(this);
    console.log(`Starting Dynamic: ${this.kind}`);

    let result: any = undefined;
    switch (this.kind) {
      case "recursive":
        result = await runRecursive(this, result);
        break;
      case "chainOfThought":
        result = await runChainOfThought(this, result);
        break;
      case "treeOfThought":
        result = await runTreeOfThought(this);
        break;
      default:
        console.error("Unknown dynamic type");
    }

    if (this.afterExecute) await this.afterExecute.call(this);
    return result;
  },
  beforeExecute: () => console.log("Preparing dynamic..."),
  afterExecute: () => console.log("Dynamic completed."),
};

export function createDynamic({
  kind,
  metaPrompts,
  beforeExecute,
  afterExecute,
}: {
  kind: DynamicTypeKind;
  metaPrompts: MetaPromptType[];
  beforeExecute?: Hook;
  afterExecute?: Hook;
}): DynamicType {
  return { ...defaultDynamic, kind, metaPrompts, beforeExecute, afterExecute };
}

// Function implementations for each dynamic type
async function runRecursive(dynamic: DynamicType, previousResult: any) {
  console.log("Running Recursive Dynamic");
  let result = previousResult;
  for (let i = 0; i < dynamic.metaPrompts.length; i++) {
    result = await dynamic.metaPrompts[i].runMetaPrompt?.(result);
    console.log("Recursively processing with result: ", result);
  }
  return result;
}

async function runChainOfThought(dynamic: DynamicType, previousResult: any) {
  console.log("Running Chain of Thought Dynamic");
  let result = previousResult;
  for (const metaPrompt of dynamic.metaPrompts) {
    result = await metaPrompt.runMetaPrompt?.(result);
  }
  return result;
}

async function runTreeOfThought(dynamic: DynamicType) {
  console.log("Running Tree of Thought Dynamic");
  // Concurrent or decision-based branching execution
  const results = await Promise.all(
    dynamic.metaPrompts.map((metaPrompt) => metaPrompt.runMetaPrompt?.()),
  );
  return results.reduce((acc, cur) => ({ ...acc, ...cur }), {});
}
