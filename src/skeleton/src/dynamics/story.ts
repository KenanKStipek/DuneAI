import { createDynamic, RECURSIVE } from "../../../";
import { DynamicType } from "../../../types";
import { dynamicStoryWritingPrompt } from "../metaPrompts";

export const dynamicStoryWritingDynamic: DynamicType = createDynamic({
  name: "Story",
  kind: RECURSIVE,
  metaPrompts: [dynamicStoryWritingPrompt],
  beforeExecute: (params) => {
    console.log(
      `Writing page ${params.currentPage} of ${params.totalPageLength}`,
    );
  },
  afterExecute: (params) => {
    if (params.currentPage < params.totalPageLength) {
      params.currentPage++;
    } else {
      console.log("Story writing completed.");
    }
  },
});
