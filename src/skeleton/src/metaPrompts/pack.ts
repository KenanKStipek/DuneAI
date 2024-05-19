import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const packBase: MetaPromptType = createMetaPrompt({
  name: "JSON_BASE",
  model: "LLAMA3",
  content: (params) => `
  Take the following information and return a string of valid JSON data of this data with the key and value listed:
  ${params.BaseAttributes}

  ONLY RETURN JSON DATA WITH OF A SINGLE DEPTH
  `,
});

export const packExtended: MetaPromptType = createMetaPrompt({
  name: "JSON_EXTENDED_BODY",
  model: "LLAMA3",
  content: (params) => `
  Take the following information and return a string of valid JSON data of this data with the key and value listed:
  ${params.ExtendedAttributes.FaceAttributes}
  ${params.ExtendedAttributes.BodyAttributes}

  ONLY RETURN JSON DATA WITH OF A SINGLE DEPTH
  `,
});

export const packExtendedIntimate: MetaPromptType = createMetaPrompt({
  name: "JSON_EXTENDED_INTIMATE",
  model: "NOUS_HERMES",
  content: (params) => `
  Take the following information and return a string of valid JSON data of this data with the key and value listed:
  ${params.ExtendedAttributes.IntimateAttributes}

  ONLY RETURN JSON DATA WITH OF A SINGLE DEPTH
  `,
});
