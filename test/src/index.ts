// @ts-ignore
import DuneAI from "duneai";
const prompts = DuneAI.importPrompts("src/Prompts.prompt");

// Define a dynamic
const dynamic = DuneAI.createDynamic({
  name: "ExampleDynamic",
  prompts: [prompts.ExamplePrompt],
  context: {
    test: 1,
  },
});

// Run the dynamic
dynamic.run();
