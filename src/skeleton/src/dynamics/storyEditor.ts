import DuneAI from "../../../";
import { DynamicType, DynamicTypeKind } from "../../../types";

const { Edit } = DuneAI.importPrompts(["src/skeleton/src/prompts/Edit.prompt"]);

export const Editor: DynamicType = DuneAI.Dynamic().create({
  name: "StoryEditor",
  kind: DuneAI.TOT as DynamicTypeKind,
  prompts: [{ Edit }],
}) as DynamicType;
