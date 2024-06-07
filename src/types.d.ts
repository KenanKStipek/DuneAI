export type AIModel = (typeof MODELS)[keyof typeof MODELS];

export type DynamicTypeKind = "chainOfThought" | "treeOfThought";

export type Hook = (state: State) => void | Promise<void>;

export type PromptType = {
  name: string;
  content: string | PromptType;
  model: AIModel;
  run: (dynamic: DynamicType, input?: any) => Promise<string>;
  context?: Record<string, any>;
};

export type DynamicType = {
  name: string;
  kind: DynamicTypeKind;
  prompts: (PromptType | Record<string, string>)[];
  dynamics?: (DynamicType | Record<string, DynamicType>)[];
  context?: any;
  run: (dynamic: DynamicType, input?: any) => Promise<void | any>;
  beforeLife?: Hook;
  afterDeath?: Hook;
  iteratable?:
    | {
        iteration?: number;
        iterationValue?: string;
        collectionKey?: string;
      }
    | {
        [key: string]: any;
      }
    | false;
};

export type IteratableItem = PromptType | DynamicType | Record<string, any>;
