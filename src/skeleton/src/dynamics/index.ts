import { createDynamic, COT } from "../../../";
import {
  characterCreationPrompt,
  enhancedStoryArcPrompt,
} from "../metaPrompts";
import { dynamicStoryWritingDynamic } from "./story";

export const getPrimeDynamic = (params: any) =>
  createDynamic({
    name: "Story",
    kind: COT,
    params,
    metaPrompts: [characterCreationPrompt, enhancedStoryArcPrompt],
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
