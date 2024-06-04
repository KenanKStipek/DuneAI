import DuneAI from "../../../";
import { DynamicType, DynamicTypeKind } from "../../../types";

const { Paragraph } = DuneAI.importPrompts([
  "src/skeleton/src/prompts/Paragraph.prompt",
]);

export const Writer: DynamicType = DuneAI.Dynamic().create({
  name: "StoryWriter",
  kind: DuneAI.COT as DynamicTypeKind,
  prompts: [{ Paragraph }],
}) as DynamicType;
