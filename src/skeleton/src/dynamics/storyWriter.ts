import { createDynamic, COT, importPrompts } from "../../../";
import { DynamicType } from "../../../types";

const { Story } = importPrompts(["src/skeleton/src/prompts/Story.prompt"]);

export const storyWriterDynamic: DynamicType = createDynamic({
  name: "StoryWriter",
  kind: COT,
  prompts: [{ Story }],
});
