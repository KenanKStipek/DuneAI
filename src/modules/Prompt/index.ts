import Mustache from "mustache";
import { PromptType, DynamicType, Hook } from "../../types";
import { ask } from "../../adapters";
import { useStore } from "../../store";
import { interpolateIteration } from "../../utils";

const beforeLife: Hook = (context) => {
  // console.log(`beforeLife: ${JSON.stringify(context)}`);
};

const afterDeath: Hook = (context) => {
  // console.log(`afterDeath: ${JSON.stringify(context)}`);
};

const run = async (prompt: PromptType, dynamic: DynamicType) => {
  const { data } = useStore.getState();
  if (prompt.beforeLife) {
    const additionalContext = await prompt.beforeLife(data);
    // @ts-ignore
    if (additionalContext) {
      Object.assign(data, additionalContext);
    }
  }

  const iterationValue = "";
  const iteration =
    prompt.iteration && -1 < 0 ? dynamic.iteration : prompt.iteration;

  const promptWithIteration = interpolateIteration(prompt.content, {
    iteration,
    iterationValue,
  });

  const interpolatedContent = Mustache.render(promptWithIteration as string, {
    ...data,
    inContextName: `${dynamic.name}.${prompt.name}`,
    iteration:
      prompt.iteration && -1 < 0 ? dynamic.iteration : prompt.iteration,
  });

  console.log(`++++\n${interpolatedContent}++++`);

  console.log(`Invoking Prompt: ${prompt.name}`);
  const aiResponse = (await ask(interpolatedContent, prompt.model)) as string;

  if (prompt.afterDeath) {
    const additionalContext = await prompt.afterDeath(data);
    // @ts-ignore
    if (additionalContext) {
      Object.assign(data, additionalContext);
    }
  }
  return aiResponse;
};

export default function Prompt() {
  return {
    create: function (content: string | Partial<PromptType>) {
      if (typeof content === "string") {
        return {
          ...this.prompt,
          content,
        };
      } else {
        return {
          ...this.prompt,
          ...content,
        };
      }
    },
    prompt: {
      name: "Prompt",
      content: "Default prompt content",
      model: "LLAMA3",
      beforeLife,
      afterDeath,
      iteration: -1,
      run: function (dynamic: DynamicType) {
        return run(this as unknown as PromptType, dynamic);
      },
    },
  };
}
