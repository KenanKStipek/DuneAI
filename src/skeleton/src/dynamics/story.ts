import { createDynamic, COT } from "../../../";
import { DynamicType } from "../../../types";
import { dynamicStoryWritingPrompt } from "../metaPrompts";

export const dynamicStoryWritingDynamic: DynamicType = createDynamic({
  name: "Story",
  kind: COT,
  metaPrompts: [
    dynamicStoryWritingPrompt,
    dynamicStoryWritingPrompt,
    dynamicStoryWritingPrompt,
  ],
});
