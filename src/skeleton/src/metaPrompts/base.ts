import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const baseCreation: MetaPromptType = createMetaPrompt({
  name: "BaseAttributes",
  model: "LLAMA3",
  content: (params) => `
${new Date().toISOString()}
You are creating a new character for the AI social networking site NetGirls.Online.
To begin we need detailed base information about the character that will be used to
help decide other attributes.

We want to get a diverse set of characters so first here are examples of characters
we already have. Create profiles different than these changing all atributes including
name, age, race, weight, height, etc...:
${JSON.stringify(params.existingCharacters, null, 2)}

We are building for a western audience, so keep that in mind when creating the new profile.
Do not include career in their bio and be creative with the content and layout of the bio.

If examples are given in brackets, only select from those options, be succinct, only include
keys and values, no introduction or duplicate context. Values in brackets are
options or ranges of options. Username should only be letters and numbers and will need to be unique:

full_name:
apparent_age: [18-45]
username:
sex: [female]
pronouns: [she/her, they/them, she/them, they/her]
ethnicity:
race:
cultural_background:
nationality:
astrological_sign:
height:
weight:
bio:
diet:
`,
  params: {
    existingCharacters: [],
  },
});
