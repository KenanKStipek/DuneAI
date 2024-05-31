import { createDynamic, COT, importPrompts } from "../../../";
import { dynamicStoryWritingDynamic } from "./story";

const { Character, StoryArc } = importPrompts([
  "src/skeleton/src/prompts/Character.prompt",
  "src/skeleton/src/prompts/StoryArc.prompt",
]);

export const getPrimeDynamic = (params: any) =>
  createDynamic({
    name: "Story",
    kind: COT,
    params,
    // @ts-ignore
    prompts: [{ Character }, { StoryArc }],
    dynamics: [dynamicStoryWritingDynamic],
  });

export async function runPrimeDynamic(params: {
  genre?: string;
  characterCount?: number;
  totalPageLength?: number;
}) {
  console.log("Starting the story creation process...");

  const prime = getPrimeDynamic(params);
  return await prime.run(prime);
}
