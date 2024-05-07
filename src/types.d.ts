export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "recursive" | "chainOfThought" | "treeOfThought";

export type Hook = (
  params?: any,
  dynamic?: DynamicType,
) => void | Promise<void>;

export type ContentFunction = (params: Record<string, any>) => string;

export interface MetaPromptType {
  name: string;
  content: string | ContentFunction;
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

export interface DynamicType {
  name: string;
  kind: DynamicTypeKind;
  metaPrompts: MetaPromptType[];
  shouldContinue: Boolean;
  dynamics?: DynamicType[];
  processingTime?: number;
  run: (
    dynamic: DynamicType,
    input?: any,
  ) => Promise<string | Record<string, string>>;
  beforeExecute?: Hook;
  afterExecute?: Hook;
  params?: any;
}
