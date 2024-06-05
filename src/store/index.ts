import { createStore } from "zustand/vanilla";

interface AppState {
  generations: Record<string, Record<string, any>>;
  context: Record<string, any>;
  setGeneration: (
    dynamicName: string,
    promptName: string,
    generation: string | object,
  ) => void;
  setContext: (context: any) => void;
}

export const useStore = createStore<AppState>((set) => ({
  generations: {},
  context: {},
  setGeneration: (dynamicName, promptName, generation) =>
    set((state) => ({
      generations: {
        ...state.generations,
        [dynamicName]: {
          ...state.generations[dynamicName],
          [promptName]: generation,
        },
      },
    })),
  setContext: (context) =>
    set((state) => ({
      context: {
        ...state.context,
        ...context,
      },
    })),
}));
