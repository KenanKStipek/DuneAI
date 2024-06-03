import DuneAI from "../../../";
import { DynamicType, DynamicTypeKind } from "../../../types";

const { Story } = DuneAI.importPrompts([
  "src/skeleton/src/prompts/Story.prompt",
]);

export const Writer: DynamicType = DuneAI.Dynamic().create({
  name: "StoryWriter",
  kind: DuneAI.COT as DynamicTypeKind,
  prompts: [{ Story }],
});
