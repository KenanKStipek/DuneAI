import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const eyesCreation: MetaPromptType = createMetaPrompt({
  name: "EyesAttributes",
  model: "LLAMA3",
  content: (params) => `
We are continuing a character profile creation. We have already defined this base information
about them:
${params.BaseAttributes}

Create a detailed description of their hair, we don't need to include their name as it is
implied in context, use measurements in millimeters as applicable. Complete this form,
leave no blank, be succinct, only include keys and values, no introduction or duplicate context:
eyebrow_shape:
eyebrow_density:
eyebrow_length:
eyebrow_arch_height:
eyebrow_arch_shape:
eye_size:
eye_shape:
eye_position:
interocular_distance:
canthal_tilt:
epicanthal_fold:
eyelid_shape:
eyelid_crease_type:
eyelash_length:
eyelash_density:
iris_color:
iris_pattern:
pupil_size:
pupil_shape:
sclera_color:
  `,
  params: {
    BaseAttributes: "",
  },
});
