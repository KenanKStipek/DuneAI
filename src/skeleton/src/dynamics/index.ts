import { createDynamic, COT } from "../../../";
import {
  characterCreationPrompt,
  storyArcPrompt,
  pageWritingPrompt,
} from "../metaPrompts";

// Character Creation Dynamic
export const characterCreationDynamic = createDynamic({
  kind: COT,
  metaPrompts: [characterCreationPrompt],
});

// Story Development Dynamic
export const storyDevelopmentDynamic = createDynamic({
  kind: COT,
  metaPrompts: [storyArcPrompt],
});

// Page Writing Dynamic
export const pageWritingDynamic = createDynamic({
  kind: COT,
  metaPrompts: [pageWritingPrompt],
});

// Prime Dynamic for orchestrating the story writing
export const primeDynamic = createDynamic({
  kind: COT,
  metaPrompts: [],
});

export async function runPrimeDynamic() {
  const characters = await characterCreationDynamic.run(); // Create characters
  const storyArc = await storyDevelopmentDynamic.run(characters); // Develop story arc based on characters
  let pageNumber = 1;
  let pageContent = {};

  do {
    pageContent = await pageWritingDynamic.run({ ...pageContent, storyArc }); // Write story pages recursively, passing the previous content and story arc
    console.log(`Page ${pageNumber++}: ${pageContent}`);
  } while (!isStoryComplete(pageContent as string)); // Check completion within the dynamic, possibly using the last page's content

  console.log("Story creation completed.");
  return "Story created successfully.";
}

function isStoryComplete(pageContent: string) {
  // Implement a more structured condition based on the content of the page
  return Math.random() < 0.1; // Random condition to end the story
}
