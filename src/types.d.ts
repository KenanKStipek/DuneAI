import type { State } from "zustand/vanilla";
import { MODELS } from "../adapters";

export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "chainOfThought" | "treeOfThought";

export type Hook = (state: State) => void | Promise<void>;

export type PromptObject = {
  name: string;
  content: string | PromptObject;
  model: AIModel;
  run: (dynamic: DynamicType) => Promise<Record<string, any>>;
  context?: Record<string, any>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

export type PromptInstruction = {
  [key: string]: string;
};

export type DynamicInstruction = {
  [key: string]: DynamicType;
};

export interface PromptType extends PromptObject {
  content: string | PromptObject;
}

export type BaseDynamicType = {
  name: string;
  kind: DynamicTypeKind;
  prompts: (PromptType | PromptInstruction)[];
  dynamics?: (DynamicType | DynamicInstruction)[];
  context?: any;
  run: () => Promise<Record<string, any>>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

export type DynamicType = BaseDynamicType & {
  kind: "chainOfThought" | "treeOfThought";
};
