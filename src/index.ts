import Prompt from "./modules/Prompt";
import Dynamic from "./modules/Dynamic";
import Iterator from "./modules/Iterator";
import { importPrompts } from "./utils/index";

export const OPENAI_API_KEY = "1";

export default {
  Prompt,
  Dynamic,
  Iterator,
  importPrompts,
  COT: "chainOfThought",
  TOT: "treeOfThought",
};
