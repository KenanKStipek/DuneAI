export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "recursive" | "chainOfThought" | "treeOfThought";

export type Hook = (
  params?: any,
  dynamic?: DynamicType,
) => void | Promise<void>;

export type ContentFunction = (params: Record<string, any>) => string;
export type OptionFunction = (
  params: Record<string, any>,
) => Record<string, any>;

export interface MetaPromptType {
  name: string;
  content: string | ContentFunction;
  options?: Record<string, any> | OptionFunction;
  dynamics: DynamicType[];
  model: AIModel;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, string>>;
  params?: Record<string, any>;
  beforeExecute?: Hook;
  afterExecute?: Hook;
}

// Using discriminated union to handle different kinds of dynamics correctly
export type BaseDynamicType = {
  name: string;
  kind: DynamicTypeKind; // Make sure this uses the updated DynamicTypeKind
  metaPrompts: MetaPromptType[];
  dynamics?: DynamicType[];
  processingTime?: number;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, string>>;
  beforeExecute?: Hook;
  afterExecute?: Hook;
  params?: any;
};

export type RecursiveDynamicType = BaseDynamicType & {
  kind: "recursive";
  shouldContinue: boolean;
};

export type NonRecursiveDynamicType = BaseDynamicType & {
  kind: "chainOfThought" | "treeOfThought";
};

export type DynamicType = RecursiveDynamicType | NonRecursiveDynamicType;
