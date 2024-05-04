import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

// MetaPrompt for creating characters
export const characterCreationPrompt: MetaPromptType = createMetaPrompt({
  content: "{{character_name}} is a {{character_description}}.",
  params: { character_name: "", character_description: "" },
});

// MetaPrompt for developing the story arc
export const storyArcPrompt: MetaPromptType = createMetaPrompt({
  content:
    "Create an outline for a story based on the characters defined above.",
});

// MetaPrompt for writing the story page by page
export const pageWritingPrompt: MetaPromptType = createMetaPrompt({
  content: "{{page_content}}",
  params: { page_content: "" },
});

export default { characterCreationPrompt, storyArcPrompt, pageWritingPrompt };
