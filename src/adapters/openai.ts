import OpenAI from "openai";
import { OPENAI_API_KEY } from "../";
import { throttledOperation } from "../utils/throttling";
import { MODELS } from "./";

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const getCompletion = async (
  content: string,
  { model, ...options } = { model: MODELS.GPT_FOUR },
) => {
  const selectedModel = model || MODELS.GPT_FOUR;
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: "user", content }],
    model: selectedModel,
    ...options,
  };
  // @ts-ignore
  const chatCompletion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(params);
  return chatCompletion.choices[0].message?.content;
};

export const ask = async (prompt: string, options?: any) => {
  return (await throttledOperation(() => getCompletion(prompt, options), {
    id: prompt,
  })) as string;
};
