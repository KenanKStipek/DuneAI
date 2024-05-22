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
bust_circumference:
bust_size:
bust_shape:
underbust_circumference:
nipple_size:
nipple_shape:
areola_size:
areola_shape:
labia_majora_size:
labia_minora_size:
labia_shape:
clitoral_size:
clitoral_shape:
vagina_depth:
vagina_width:
vagina_shape:
vulva_symmetry:
mons_pubis_size:
pubic_hair_style:
pubic_hair_density:
perineum_size:
anus_shape:
anus_size:
intimate_skin_texture:
intimate_skin_tone:
  `,
  params: {
    BaseAttributes: "",
  },
});
