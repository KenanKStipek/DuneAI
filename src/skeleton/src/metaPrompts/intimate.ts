import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const intimateCreation: MetaPromptType = createMetaPrompt({
  name: "IntimateAttributes",
  model: "NOUS_HERMES",
  content: (params) => `
  We are continuing a character profile creation. We have already defined this base information
  about them:
  ${params.BaseAttributes}

  Create a detailed description of their body, we don't need to include their name as it is
  implied in context, use measurements in millimeters as applicable.
  Complete this form, only include keys and values, no introduction or duplicate context:
	Bust Circumference:
	Bust Size:
	Bust Shape:
	Underbust Circumference:
	Nipple Size:
	Nipple Shape:
	Areola Size:
	Areola Shape:
	Labia Majora Size:
	Labia Minora Size:
	Labia Shape:
	Clitoral Size:
	Clitoral Shape:
	Vagina Depth:
	Vagina Width:
	Vagina Shape:
	Vulva Symmetry:
	Mons Pubis Size:
	Pubic Hair Style:
	Pubic Hair Density:
	Perineum Size:
	Anus Shape:
	Anus Size:
	Intimate Skin Texture:
	Intimate Skin Tone:
  `,
  params: {
    BaseAttributes: "",
  },
});
