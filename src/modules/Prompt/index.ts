import Mustache from "mustache";
import { PromptType, DynamicType } from "../../types";
import { ask } from "../../adapters";
import { useStore } from "../../store";
import { interpolateIteration } from "../../utils";

const run = async (prompt: PromptType, dynamic: DynamicType) => {
  const data = useStore.getState();

  // @ts-ignore
  const iterationValue = dynamic.iteratable?.iterationValue || "";
  // @ts-ignore
  const iteration = dynamic.iteratable?.iteration || -1;

  const promptWithIteration =
    (iteration &&
      interpolateIteration(prompt.content, {
        iteration,
        iterationValue,
      })) ||
    prompt.content;

  const interpolatedContent = Mustache.render(promptWithIteration as string, {
    ...{
      context: data.context,
      ...data.generations,
    },
    generationName: `${dynamic.name}.${prompt.name}`,
    iterationValue,
    iteration,
  });

  console.log(`++++\n${interpolatedContent}++++`);

  console.log(`Invoking Prompt: ${prompt.name}`);
  const aiResponse = (await ask(interpolatedContent, prompt.model)) as string;
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
      model: "GPT_FOUR",
      run: function (dynamic: DynamicType) {
        return run(this as unknown as PromptType, dynamic);
      },
    },
  };
}
