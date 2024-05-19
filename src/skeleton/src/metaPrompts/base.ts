import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const baseCreation: MetaPromptType = createMetaPrompt({
  name: "BaseAttributes",
  model: "LLAMA3",
  content: (params) => `
    You are creating a new character for the AI social networking site NetGirls.Online.
    To begin we need detailed base information about the character that will be used to
    help decide other attributes.

    We want to get a diverse set of characters so first
    here are examples of characters we already have:
    ${params.existingCharacters}

    We are building for a western audience, so keep that in mind when creating the new profile.

    Fill out this form of attributes that are enternally consistent, if examples are
    given in brackets, only select from those options, be succinct:
    Full Name:
    Apparent Age: [18-45]
    Sex: [Female]
    Pronouns: [She/Her, They/Them, She/Them, They/Her]
    Ethnicity:
    Race:
    Cultural Background:
    Nationality:
    Astrological Sign:
    Height:
    Weight:
  `,
  params: {
    existingCharacters: [],
  },
});
