import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

const NEGATIVE_PROMPT_DEFAULTS =
  "Ugly, Bad anatomy, Bad proportions, Bad quality, Blurry, Cropped, Deformed, Disconnected limbs, Out of frame, Out of focus, Dehydrated, Error, Disfigured, Disgusting, Extra arms, Extra limbs, Extra hands, Fused fingers, Gross proportions, Long neck, Low res, Low quality, Jpeg, Jpeg artifacts, Malformed limbs, Mutated, Mutated hands, Mutated limbs, Missing arms, Missing fingers, Picture frame, Poorly drawn hands, Poorly drawn face, Text, Signature, Username, Watermark, Worst quality, Collage, Pixel, Pixelated, Grainy, Bad anatomy, Bad hands, Amputee, Missing fingers, Missing hands, Missing limbs, Missing arms, Extra fingers, Extra hands, Extra limbs, Mutated hands, Mutated, Mutation, Multiple heads, Malformed limbs, Disfigured, Poorly drawn hands, Poorly drawn face, Long neck, Fused fingers, Fused hands, Dismembered, Duplicate, Improper scale, Ugly body, Cloned face, Cloned body, Gross proportions, Body horror, Too many fingers, Cartoon, CGI, Render, 3D, Artwork, Illustration, 3D render, Cinema 4D, Artstation, Octane render, Painting, Oil painting, Anime, 2D, Sketch, Drawing, Bad photography, Bad photo, Deviant art";

const NSFW_NEGATIVE_PROMPT = "Nsfw, Uncensored, Cleavage, Nude, Nipples";

const POSITIVE_PROMPT_DEFAULTS = "";

export const profileImagePromptCreation: MetaPromptType = createMetaPrompt({
  name: "ProfileImagePrompt",
  model: "GPT_FOUR",
  content: (params) => `
  I need a prompt for a realistic profile picture, do not include hats or clothing
  that obstructs the face. This should be a nearly straight on headshot image. Only
  return a single string of the prompt, do not make image parameter reccomendations
  outside of describing the person:
  ${params.BaseAttributes}
  ${params.ExtendedAttributes.FaceAttributes}
  `,
  params: {
    existingCharacters: [],
  },
});

export const profileImageCreation: MetaPromptType = createMetaPrompt({
  name: "ProfileImage",
  model: "SD",
  options: (params: Record<string, any>) => ({
    prompt: params.ProfileImage.ProfileImagePrompt,
    negativePrompt: `${NEGATIVE_PROMPT_DEFAULTS}, ${NSFW_NEGATIVE_PROMPT}`,
  }),
  content: () => ``,
  params: {
    existingCharacters: [],
  },
});
