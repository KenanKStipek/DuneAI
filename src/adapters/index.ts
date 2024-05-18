export { ask } from "./gpt4all";

export const MODELS = {
  GPT_FOUR: "gpt-4-0125-preview",
  GPT_FOUR_BIG: "gpt-4-32k",
  GPT_THREE: "gpt-3.5-turbo",
  MISTRAL_7B: "mistral-7b-openorca.gguf2.Q4_0.gguf",
  ORCA_MINI_3B: "orca-mini-3b-gguf2-q4_0.gguf",
  NOUS_HERMES: "nous-hermes-llama2-13b.Q4_0.gguf",
  SD: "sd",
} as const;
