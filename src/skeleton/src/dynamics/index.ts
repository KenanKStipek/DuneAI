import DuneAI from "../../../";
import { DynamicTypeKind } from "../../../types";
import { Writer } from "./storyWriter";

const { Character, StoryArc } = DuneAI.importPrompts([
  "src/skeleton/src/prompts/Character.prompt",
  "src/skeleton/src/prompts/StoryArc.prompt",
]);

export const getPrimeDynamic = (context: any) =>
  DuneAI.Dynamic().create({
    name: "Story",
    kind: DuneAI.COT as DynamicTypeKind,
    context,
    prompts: [{ Character }, { StoryArc }],
    dynamics: [{ Writer }],
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
