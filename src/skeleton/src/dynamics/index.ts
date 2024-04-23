import { Dynamic, MetaPrompt } from "@duneai/modules";

import prompt from "../metaPrompts/primePrompt";

export const PrimeDynamic = async ({ input }: { input: string }) => {
  const metaPrompt: string = MetaPrompt.create(prompt, input);
  const completion = await Dynamic.rec(metaPrompt, 1);
  return completion;
};
