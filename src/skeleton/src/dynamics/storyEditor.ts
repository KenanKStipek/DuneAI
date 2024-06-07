import DuneAI from "../../../";
import { DynamicType, DynamicTypeKind } from "../../../types";

const { Edit } = DuneAI.importPrompts(["src/skeleton/src/prompts/Edit.prompt"]);

export const Editor: DynamicType = DuneAI.Dynamic().create({
  name: "StoryEditor",
  kind: DuneAI.COT as DynamicTypeKind,
  prompts: [{ Edit }],
} as unknown as DynamicType) as DynamicType;
