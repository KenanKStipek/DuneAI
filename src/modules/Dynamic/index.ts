import { PromptType, DynamicType, Hook, DynamicTypeKind } from "../../types";
import Prompt from "../Prompt";
import { useStore } from "../../store";

const beforeLife: Hook = async (context) => {
  // console.log(`beforeLife: ${JSON.stringify(context)}`);
};

const afterDeath: Hook = async (context) => {
  // console.log(`afterDeath: ${JSON.stringify(context)}`);
};

const runChainOfThought = async (dynamic: DynamicType) => {
  console.log(`Running ${dynamic.name} Dynamic`);
  const { getState } = useStore;
  const { setResponse } = getState();
  let result = { ...getState().data[dynamic.name] };

  for (const prompt of dynamic.prompts) {
    const newPrompt = Prompt().create(prompt);
    const output = await newPrompt.run(dynamic);
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      setResponse(dynamic.name, newPrompt.name, output[newPrompt.name]);
    }
  }

  for (const subDynamic of dynamic.dynamics || []) {
    const newSubDynamic = Dynamic().create(subDynamic as DynamicType);
    const output = await newSubDynamic.run();
    if (typeof output === "object" && output !== null) {
      result = { ...result, ...output };
      setResponse(dynamic.name, newSubDynamic.name, output[newSubDynamic.name]);
    }
  }

  return result;
};

const runTreeOfThought = async (dynamic: DynamicType) => {
  console.log(`Running ${dynamic.name} Tree of Thought Dynamic`);
  const { getState } = useStore;
  const { setResponse } = getState();
  let result = { ...getState().data[dynamic.name] };

  const promptResults = await Promise.all(
    dynamic.prompts.map((prompt) => {
      const newPrompt = Prompt().create(prompt);
      return newPrompt.run(dynamic);
    }),
  );

  promptResults.forEach((output) => {
    if (typeof output === "object" && output !== null) {
      const name = Object.keys(output)[0];
      result = { ...result, ...output };
      setResponse(dynamic.name, name, output[name]);
    }
  });

  const dynamicResults = await Promise.all(
    dynamic.dynamics?.map(async (subDynamic) => {
      const newSubDynamic = Dynamic().create(subDynamic as DynamicType);
      const output = await newSubDynamic.run();
      return output;
    }) || [],
  );

  const combinedResults: Record<string, string> = {};
  [...promptResults, ...dynamicResults].forEach((result) => {
    if (typeof result === "string") {
      combinedResults["combinedString"] =
        (combinedResults["combinedString"] || "") + result;
    } else if (typeof result === "object" && result !== null) {
      Object.assign(combinedResults, result);
      const name = Object.keys(result)[0];
      setResponse(dynamic.name, name, result[name]);
    }
  });

  return combinedResults;
};

const run = async (dynamic: DynamicType) => {
  const { getState } = useStore;
  const { setResponse } = getState();

  if (dynamic.beforeLife) {
    const beforeLifeResult = await dynamic.beforeLife(
      getState().data[dynamic.name],
    );
    // @ts-ignore
    if (beforeLifeResult) {
      setResponse(dynamic.name, "beforeLife", beforeLifeResult);
    }
  }

  console.log(`Starting Dynamic: ${dynamic.kind}`);

  let result: any;
  switch (dynamic.kind) {
    case "chainOfThought":
      result = await runChainOfThought(dynamic);
      break;
    case "treeOfThought":
      result = await runTreeOfThought(dynamic);
      break;
    default:
      console.error("Unknown dynamic type");
      return {};
  }

  if (dynamic.afterDeath) {
    const afterDeathResult = await dynamic.afterDeath(result);
    // @ts-ignore
    if (afterDeathResult) {
      setResponse(dynamic.name, "afterDeath", afterDeathResult);
    }
  }

  setResponse(dynamic.name, "context", result);
  return { [dynamic.name]: result };
};

export default function Dynamic() {
  return {
    create: function (context: {
      name: string;
      kind: DynamicTypeKind;
      prompts: (PromptType | Record<string, string>)[];
      beforeLife?: Hook;
      afterDeath?: Hook;
      dynamics?: (DynamicType | Record<string, DynamicType>)[];
      context?: object;
    }) {
      const instantiatedPrompts: PromptType[] = context.prompts.map(
        (prompt) => {
          if ("name" in prompt && "content" in prompt) {
            return prompt as PromptType;
          } else {
            const key = Object.keys(prompt)[0];
            const value = prompt[key];
            return { name: key, content: value } as PromptType;
          }
        },
      );

      const instantiatedDynamics: DynamicType[] =
        context.dynamics?.map((dynamic) => {
          if ("name" in dynamic && "kind" in dynamic) {
            return dynamic as DynamicType;
          } else {
            const key = Object.keys(dynamic)[0];
            const value = dynamic[key];
            return Dynamic().create({ ...value, name: key });
          }
        }) || [];

      return {
        ...this.dynamic,
        ...context,
        prompts: instantiatedPrompts,
        dynamics: instantiatedDynamics,
      };
    },
    dynamic: {
      name: "defaultDynamic",
      kind: "chainOfThought",
      prompts: [],
      dynamics: [],
      context: {},
      run: function () {
        return run(this as unknown as DynamicType);
      },
      beforeLife,
      afterDeath,
    },
  };
}
