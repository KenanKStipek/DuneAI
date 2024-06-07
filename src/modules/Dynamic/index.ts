import { PromptType, DynamicType, Hook, DynamicTypeKind } from "../../types";
import Prompt from "../Prompt";
import Iterator from "../Iterator";
import { useStore } from "../../store";

const beforeLife: Hook = async (context) => {
  // console.log(`beforeLife: ${JSON.stringify(context)}`);
};

const afterDeath: Hook = async (context) => {
  // console.log(`afterDeath: ${JSON.stringify(context)}`);
};

const runChainOfThought = async (dynamic: DynamicType) => {
  console.log(`Running ${dynamic.name} Dynamic`);
  const { generations, setGeneration } = useStore.getState();

  for (const prompt of dynamic.prompts) {
    const generation = await (prompt as PromptType).run(dynamic);
    setGeneration(dynamic.name, prompt.name, generation);
  }

  // WORKING ON GETTING THE ITERATION BY COLLECTION KEY WORKING

  // If the dynamics collection is an iterable dynamic with collectionKey
  // regenerate the Iterator with the collection from the store.
  //
  //
  // @ts-ignore
  // console.log(
  //   // @ts-ignore
  //   generations[dynamic?.iteratable?.collectionKey?.()]?.iterated ??
  //     Object.values(
  //       // @ts-ignore
  //       generations[dynamic?.iteratable?.collectionKey?.()]?.iterated,
  //     ),
  // );
  // // @ts-ignore
  // if (!!dynamic?.iteratable?.collectionKey?.()) {
  //   // console.log({
  //   //   // @ts-ignore
  //   //   iterated:
  //   //     // @ts-ignore
  //   //     generations[dynamic?.iteratable?.collectionKey?.()]?.iterated ??
  //   //     Object.values(
  //   //       // @ts-ignore
  //   //       generations[dynamic?.iteratable?.collectionKey?.()]?.iterated,
  //   //     ),
  //   // });

  //   dynamic.dynamics = Iterator(dynamic.dynamics as DynamicType[], {
  //     collection: Object.values(
  //       // @ts-ignore
  //       generations[dynamic?.iteratable?.collectionKey]?.iterated,
  //     ),
  //   });
  // }

  for (const subDynamic of dynamic.dynamics || []) {
    const generation = await (subDynamic as DynamicType).run(
      subDynamic as DynamicType,
    );
    setGeneration(dynamic.name, (subDynamic as DynamicType).name, generation);
    if (subDynamic.iteratable) {
      const { generations } = useStore.getState();
      setGeneration(dynamic.name, "iterated", {
        ...generations[dynamic.name].iterated,
        // @ts-ignore
        [subDynamic.iteratable?.iteration]: generation,
      });
    }
  }

  const result = useStore.getState().generations[dynamic.name];
  return result;
};

const runTreeOfThought = async (dynamic: DynamicType) => {
  console.log(`Running ${dynamic.name} Tree of Thought Dynamic`);
  const { getState } = useStore;
  const { setGeneration } = getState();
  let result = { ...getState().generations[dynamic.name], ...dynamic.context };

  const promptResults = await Promise.all(
    dynamic.prompts.map((prompt) => {
      const newPrompt = Prompt().create(prompt);
      return newPrompt.run(dynamic);
    }),
  );

  promptResults.forEach((output) => {
    if (typeof output === "object" && output !== null) {
      const name = Object.keys(output)[0];
      result = { ...result };
      setGeneration(dynamic.name, name, output[name]);
    }
  });

  const dynamicResults = await Promise.all(
    dynamic.dynamics?.map(async (subDynamic) => {
      const newSubDynamic = Dynamic().create(subDynamic as DynamicType);
      // @ts-ignore
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
      // @ts-ignore
      setGeneration(dynamic.name, name, result[name]);
    }
  });

  return combinedResults;
};

const run = async (dynamic: DynamicType) => {
  const { getState } = useStore;
  const { setGeneration } = getState();

  if (dynamic.beforeLife) {
    const beforeLifeResult = await dynamic.beforeLife(
      getState().generations[dynamic.name],
    );
    // @ts-ignore
    if (beforeLifeResult) {
      setGeneration(dynamic.name, "beforeLife", beforeLifeResult);
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
      setGeneration(dynamic.name, "afterDeath", afterDeathResult);
    }
  }

  setGeneration(dynamic.name, "context", dynamic.context);
  return result;
};

export default function Dynamic() {
  return {
    create: function (params: DynamicType) {
      const { getState } = useStore;
      const { setContext } = getState();
      setContext(params.context);

      const instantiatedPrompts: PromptType[] = params.prompts.map((prompt) => {
        if ("name" in prompt && "content" in prompt) {
          return prompt as PromptType;
        } else {
          const key = Object.keys(prompt)[0];
          const value = prompt[key];
          return Prompt().create({ name: key, content: value });
        }
      });

      // @ts-ignore
      const instantiatedDynamics: DynamicType[] =
        params.dynamics?.map((dynamic) => {
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
        ...params,
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
      iteratable: false,
      beforeLife,
      afterDeath,
    },
  };
}
