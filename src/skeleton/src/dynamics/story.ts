import { createDynamic, COT, importPrompts } from "../../../";
import { DynamicType } from "../../../types";

const { Story } = importPrompts(["src/skeleton/src/prompts/Story.prompt"]);

export const dynamicStoryWritingDynamic: DynamicType = createDynamic({
  name: "Story",
  kind: COT,
  // @ts-ignore
  prompts: [{ Story }],
});
