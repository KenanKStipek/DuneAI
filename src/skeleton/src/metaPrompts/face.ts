import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const faceCreation: MetaPromptType = createMetaPrompt({
  name: "FaceAttributes",
  model: "LLAMA3",
  content: (params) => `
We are continuing a character profile creation. We have already defined this base information
about them:
${params.BaseAttributes}

Create a detailed description of their face, we don't need to include their name as it is
implied in context, use measurements in millimeters as applicable. Complete this form,
leave no blank, be succinct, only include keys and values, no introduction or duplicated context:
skin_texture:
skin_pore_size:
forehead_height:
forehead_width:
hairline_shape:
nose_length:
nose_width:
nose_bridge_height:
nose_bridge_width:
nose_tip_shape:
nasal_base_width:
nostril_shape:
nostril_size:
cheekbone_height:
cheekbone_width:
cheek_fullness:
malar_fat_pad_size:
midface_length:
zygomatic_arch:
philtrum_length:
philtrum_depth:
lip_size:
lip_shape:
lip_fullness:
cupid’s_bow_shape:
lip_border_definition:
lip_color:
mouth_width:
smile_type:
tooth_size:
tooth_shape:
tooth_color:
dental_alignment:
jawline_shape:
jaw_width:
chin_shape:
chin_size:
chin_cleft:
temporal_fossa_depth:
parotid_region:
buccal_fat_pad_size:
mandible_angle:
nasolabial_fold_depth:
periorbital_area:
perioral_area:
facial_hair_type:
facial_hair_density:
  `,
  params: {
    BaseAttributes: "",
  },
});
