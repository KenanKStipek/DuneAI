import Prompt from "./modules/Prompt";
import Dynamic from "./modules/Dynamic";
import { importPrompts } from "./utils/index";

export const OPENAI_API_KEY = "1";

export default {
  Prompt,
  Dynamic,
  importPrompts,
  COT: "chainOfThought",
  TOT: "treeOfThought",
};
