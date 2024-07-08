import * as path from "path";
import DuneAI from "../../../";
import { DynamicType } from "../../../types";

const fullPath = path.resolve(__dirname, "../prompts/");
const { Languages, HelloWorld, Respond } = DuneAI.importPrompts(fullPath);

const COUNT = 5;

const SayHelloWorld: DynamicType = DuneAI.Dynamic({
  name: "Say",
  context: {
    Count: COUNT,
  },
  prompts: [
    { Languages },
    ...DuneAI.Iterator([{ HelloWorld }], { iterations: COUNT }),
    { Respond },
  ],
}) as DynamicType;

export async function runDynamic() {
  // @ts-ignore
  return await SayHelloWorld.run();
}
