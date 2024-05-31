export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "chainOfThought" | "treeOfThought";

export type Hook = (
  context?: any,
  dynamic?: DynamicType,
) => void | Promise<void>;

type PromptObject = {
  name: string;
  content: string | PromptObject;
  model: AIModel;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, any>>;
  context?: Record<string, any>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

type PromptInstruction = {
  [key: string]: string;
};

export interface PromptType extends PromptObject {
  content: string | PromptObject;
}

export type BaseDynamicType = {
  name: string;
  kind: DynamicTypeKind;
  prompts: PromptInstruction[];
  dynamics?: DynamicType[];
  context?: any;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, string>>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

export type DynamicType = BaseDynamicType & {
  kind: "chainOfThought" | "treeOfThought";
};
