import { MODELS } from "./adapters";
export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "recursive" | "chainOfThought" | "treeOfThought";
export type Hook = () => void | Promise<void>;

export interface MetaPromptType {
  content: string;
  params: Record<string, any>;
  dynamics: DynamicType[];
  model: AIModel;
  runMetaPrompt?: (input?: string) => Promise<{}>;
  beforeExecute?: Hook;
  afterExecute?: Hook;
}

export interface DynamicType {
  kind: DynamicTypeKind;
  metaPrompts: MetaPromptType[];
  dynamics?: DynamicType[]; // Optional array of sub-dynamics
  processingTime?: number;
  run: (params?: any) => Promise<any>; // Allow parameters to be passed
  beforeExecute?: Hook;
  afterExecute?: Hook;
}

export interface PrimeDynamicType {
  id: string;
  description: string;
  metaPrompts: MetaPromptType[];
  run: () => Promise<void>;
  beforeExecute?: Hook;
  afterExecute?: Hook;
}
