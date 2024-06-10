import DuneAI from "../../../";
import { DynamicType, DynamicTypeKind } from "../../../types";
import { Writer } from "./storyWriter";
import { Editor } from "./storyEditor";

const { Character, StoryArc, Outline, writeReadme, writeReadmeOutline } =
  DuneAI.importPrompts([
    "src/skeleton/src/prompts/Character.prompt",
    "src/skeleton/src/prompts/StoryArc.prompt",
    "src/skeleton/src/prompts/writeReadme.prompt",
    "src/skeleton/src/prompts/writeReadmeOutline.prompt",
  ]);

const WriteReadme = DuneAI.Dynamic().create({
  name: "WriteReadme",
  kind: DuneAI.COT as DynamicTypeKind,
  prompts: [{ writeReadme }],
} as unknown as DynamicType);

// export const getPrimeDynamic = (context: any) =>
//   DuneAI.Dynamic().create({
//     name: "Story",
//     kind: DuneAI.COT as DynamicTypeKind,
//     context,
//     prompts: [{ Character }, { StoryArc }],
//     dynamics: [
//       ...DuneAI.Iterator([{ Writer }], { iterations: context.paragraphCount }),
//     ] as DynamicType[],
//   } as unknown as DynamicType);
//
export const getPrimeDynamic = (context: any) =>
  DuneAI.Dynamic().create({
    name: "ReadmePlan",
    kind: DuneAI.COT as DynamicTypeKind,
    context,
    prompts: [{ writeReadmeOutline }],
    // @ts-ignore
    dynamics: DuneAI.Iterator([{ WriteReadme }], {
      iterations: 11,
    }) as DynamicType[],
  } as unknown as DynamicType);

export async function runPrimeDynamic(params: {
  project: string;
  readmeExample: string;
  // genre?: string;
  // characterCount?: number;
  // paragraphCount?: number;
  // author?: string;
}) {
  console.log("Starting the story creation process...");

  const prime = getPrimeDynamic(params);
  return await prime.run(prime as DynamicType);
}
