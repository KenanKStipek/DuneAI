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
    leave no blank, be succinct, only include keys and values, no introduction or duplicate context:
    Skin Texture:
    Skin Pore Size:
    Forehead Height:
    Forehead Width:
    Hairline Shape:
    Eyebrow Shape:
    Eyebrow Density:
    Eyebrow Length:
    Eyebrow Arch Height:
    Eyebrow Arch Shape:
    Eye Size:
    Eye Shape:
    Eye Position:
    Interocular Distance:
    Canthal Tilt:
    Epicanthal Fold:
    Eyelid Shape:
    Eyelid Crease Type:
    Eyelash Length:
    Eyelash Density:
    Iris Color:
    Iris Pattern:
    Pupil Size:
    Pupil Shape:
    Sclera Color:
    Nose Length:
    Nose Width:
    Nose Bridge Height:
    Nose Bridge Width:
    Nose Tip Shape:
    Nasal Base Width:
    Nostril Shape:
    Nostril Size:
    Cheekbone Height:
    Cheekbone Width:
    Cheek Fullness:
    Malar Fat Pad Size:
    Midface Length:
    Zygomatic Arch:
    Philtrum Length:
    Philtrum Depth:
    Lip Size:
    Lip Shape:
    Lip Fullness:
    Cupid’s Bow Shape:
    Lip Border Definition:
    Lip Color:
    Mouth Width:
    Smile Type:
    Tooth Size:
    Tooth Shape:
    Tooth Color:
    Dental Alignment:
    Jawline Shape:
    Jaw Width:
    Chin Shape:
    Chin Size:
    Chin Cleft:
    Temporal Fossa Depth:
    Parotid Region:
    Buccal Fat Pad Size:
    Mandible Angle:
    Nasolabial Fold Depth:
    Periorbital Area:
    Perioral Area:
    Facial Hair Type:
    Facial Hair Density:
  `,
  params: {
    BaseAttributes: "",
  },
});
