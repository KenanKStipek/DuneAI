import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const characterCreationPrompt: MetaPromptType = createMetaPrompt({
  name: "Characters",
  content: (params) =>
    `Create ${params.characterCount} characters for a ${params.genre} story. Provide a name, a brief description, and their role in the story for each character.`,
  params: {
    genre: "",
    characterCount: 0,
  },
});

export const enhancedStoryArcPrompt: MetaPromptType = createMetaPrompt({
  name: "StoryArc",
  content: (params) =>
    `Develop a detailed outline for a ${params.genre} story with these ${params.characterCount} characters: ${params.Characters}`,
  params: { genre: "", characterCount: 0, Characters: "" },
});

export const dynamicStoryWritingPrompt: MetaPromptType = createMetaPrompt({
  name: "Story",
  content: (params) => `
You are writing a story, here is the information for the story:
Story outline: ${params.StoryArc}
Story characters: ${params.Characters}
Write the first page, only start the first section of the story outline...`,
});

export default {
  characterCreationPrompt,
  enhancedStoryArcPrompt,
  dynamicStoryWritingPrompt,
};
