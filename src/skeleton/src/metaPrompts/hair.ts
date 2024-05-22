import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const hairCreation: MetaPromptType = createMetaPrompt({
  name: "HairAttributes",
  model: "LLAMA3",
  content: (params) => `
We are continuing a character profile creation. We have already defined this base information
about them:
${params.BaseAttributes}

Create a detailed description of their hair, we don't need to include their name as it is
implied in context, use measurements in millimeters as applicable. Complete this form,
leave no blank, be succinct, only include keys and values, no introduction or duplicate context:
hair_color:
hair_length:
hair_texture:
hair_thickness:
hair_density:
hair_parting:
hair_volume:
hair_style:
hair_shine:
hair_highlights:
hair_ends:
hair_movement:
hair_scalp_visibility:
hair_frizz_level:
hair_accessories:
  `,
  params: {
    BaseAttributes: "",
  },
});
