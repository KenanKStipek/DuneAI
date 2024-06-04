import { PromptType, DynamicType, IteratableItem } from "../../types";
import Dynamic from "../Dynamic";
import Prompt from "../Prompt";

export default function Iterator(
  items: IteratableItem[],
  times: number,
): (DynamicType | PromptType)[] {
  const iteratedItems: (DynamicType | PromptType)[] = [];

  for (let iteration = 0; iteration < times; iteration++) {
    items.forEach((item) => {
      if ("kind" in item) {
        // Item is a DynamicType
        const dynamic = item as DynamicType;
        const newDynamic = Dynamic().create({
          ...dynamic,
          name: `${dynamic.name}_iteration_${iteration + 1}`,
          iteration: iteration + 1,
        });
        iteratedItems.push(newDynamic as DynamicType);
      } else if ("content" in item) {
        // Item is a PromptType
        const prompt = item as PromptType;
        const newPrompt = Prompt().create({
          ...prompt,
          name: `${prompt.name}_iteration_${iteration + 1}`,
          iteration: iteration + 1,
        });
        iteratedItems.push(newPrompt);
      } else {
        // Item is an object that needs to be instantiated
        const key = Object.keys(item)[0];
        const value = item[key];
        if (typeof value === "object" && "kind" in value) {
          const dynamic = value as DynamicType;
          const newDynamic = Dynamic().create({
            ...dynamic,
            name: `${key}_iteration_${iteration + 1}`,
            iteration: iteration + 1,
          });
          iteratedItems.push(newDynamic as DynamicType);
        } else if (typeof value === "string") {
          const newPrompt = Prompt().create({
            name: `${key}_iteration_${iteration + 1}`,
            content: value,
            iteration: iteration + 1,
          });
          iteratedItems.push(newPrompt);
        }
      }
    });
  }

  return iteratedItems;
}
