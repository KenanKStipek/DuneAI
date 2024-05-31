import { createDynamic, COT, importPrompts } from "../../../";
import { storyWriterDynamic } from "./storyWriter";

const { Character, StoryArc } = importPrompts([
  "src/skeleton/src/prompts/Character.prompt",
  "src/skeleton/src/prompts/StoryArc.prompt",
]);

export const getPrimeDynamic = (context: any) =>
  createDynamic({
    name: "Story",
    kind: COT,
    context,
    prompts: [{ Character }, { StoryArc }],
    dynamics: [storyWriterDynamic],
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
