import { Prompt, Dynamic } from "duneai/src";
const prompts = Prompt.importPrompts("./Prompts.prompt");

// Define a dynamic
const dynamic = Dynamic.createDynamic({
  name: "ExampleDynamic",
  prompts: [prompts.ExamplePrompt],
});

// Run the dynamic
dynamic.run();
