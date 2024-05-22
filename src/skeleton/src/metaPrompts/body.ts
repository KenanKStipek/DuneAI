import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const bodyCreation: MetaPromptType = createMetaPrompt({
  name: "BodyAttributes",
  model: "LLAMA3",
  content: (params) => `
We are continuing a character profile creation. We have already defined this base information
about them:
${params.BaseAttributes}

Create a detailed description of their body, we don't need to include their name as it is
implied in context, use measurements in millimeters as applicable. Complete this form,
leave no blank, be succinct, only include keys and values, no introduction or duplicate context:
neck_circumference:
neck_length:
neck_shape:
shoulder_width:
shoulder_height:
shoulder_slope:
chest_circumference:
rib_cage_circumference:
upper_back_width:
upper_back_length:
waist_circumference:
waist_to_hip_ratio:
abdomen_circumference:
lower_back_width:
lower_back_length:
hip_circumference:
hip_width:
pelvic_tilt:
pelvic_width:
upper_arm_circumference:
upper_arm_length:
bicep_size:
tricep_size:
elbow_circumference:
elbow_shape:
forearm_circumference:
forearm_length:
wrist_circumference:
hand_size:
hand_length:
palm_width:
finger_length:
finger_circumference:
thumb_length:
thumb_circumference:
thigh_circumference:
thigh_length:
hamstring_size:
knee_circumference:
knee_shape:
calf_circumference:
calf_length:
shin_length:
ankle_circumference:
foot_length:
foot_width:
toe_length:
toe_circumference:
  `,
  params: {
    BaseAttributes: "",
  },
});
