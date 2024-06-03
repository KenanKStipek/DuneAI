export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "chainOfThought" | "treeOfThought";

export type Hook = (state: State) => void | Promise<void>;

export type PromptType = {
  name: string;
  content: string | PromptType;
  model: AIModel;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, any>>;
  context?: Record<string, any>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

export type DynamicType = {
  name: string;
  kind: DynamicTypeKind;
  prompts: (PromptType | Record<string, string>)[];
  dynamics?: (DynamicType | Record<string, DynamicType>)[];
  context?: any;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, string>>;
  beforeLife?: Hook;
  afterDeath?: Hook;
};

export type IteratableItem = PromptType | DynamicType | Record<string, any>;
