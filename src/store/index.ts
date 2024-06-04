import { createStore } from "zustand/vanilla";

interface AppState {
  data: Record<string, Record<string, any>>;
  setResponse: (dynamicName: string, promptName: string, response: any) => void;
  setContext: (context: any) => void;
}

export const useStore = createStore<AppState>((set) => ({
  data: {},
  setResponse: (dynamicName, promptName, response) =>
    set((state) => ({
      data: {
        ...state.data,
        [dynamicName]: {
          ...state.data[dynamicName],
          [promptName]: response,
        },
      },
    })),
  setContext: (context) =>
    set((state) => ({
      data: {
        ...state.data,
        context: context,
      },
    })),
}));
