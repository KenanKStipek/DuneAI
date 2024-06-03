import Mustache from "mustache";
import { PromptType, DynamicType, Hook } from "../../types";
import { ask } from "../../adapters";
import { useStore } from "../../store";

const beforeLife: Hook = (context) => {
  // console.log(`beforeLife: ${JSON.stringify(context)}`);
};

const afterDeath: Hook = (context) => {
  // console.log(`afterDeath: ${JSON.stringify(context)}`);
};

const run = async (prompt: PromptType, dynamic: DynamicType) => {
  const { setResponse, data } = useStore.getState();
  if (prompt.beforeLife) {
    const additionalContext = await prompt.beforeLife(data);
    // @ts-ignore
    if (additionalContext) {
      Object.assign(data, additionalContext);
    }
  }

  const interpolatedContent = Mustache.render(prompt.content as string, data);

  console.log(`Invoking Prompt: ${prompt.name}`);
  const aiResponse = (await ask(interpolatedContent, prompt.model)) as string;

  if (prompt.afterDeath) {
    const additionalContext = await prompt.afterDeath(data);
    // @ts-ignore
    if (additionalContext) {
      Object.assign(data, additionalContext);
    }
  }

  setResponse(dynamic.name, prompt.name, aiResponse);
  return { [prompt.name]: aiResponse };
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
      run: function (dynamic: DynamicType) {
        return run(this as unknown as PromptType, dynamic);
      },
    },
  };
}
