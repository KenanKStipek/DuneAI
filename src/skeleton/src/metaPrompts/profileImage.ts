import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

const NEGATIVE_PROMPT_DEFAULTS =
  "Ugly, Bad anatomy, Bad proportions, Bad quality, Blurry, Cropped, Deformed, Disconnected limbs, Out of frame, Out of focus, Dehydrated, Error, Disfigured, Disgusting, Extra arms, Extra limbs, Extra hands, Fused fingers, Gross proportions, Long neck, Low res, Low quality, Jpeg, Jpeg artifacts, Malformed limbs, Mutated, Mutated hands, Mutated limbs, Missing arms, Missing fingers, Picture frame, Poorly drawn hands, Poorly drawn face, Text, Signature, Username, Watermark, Worst quality, Collage, Pixel, Pixelated, Grainy, Bad anatomy, Bad hands, Amputee, Missing fingers, Missing hands, Missing limbs, Missing arms, Extra fingers, Extra hands, Extra limbs, Mutated hands, Mutated, Mutation, Multiple heads, Malformed limbs, Disfigured, Poorly drawn hands, Poorly drawn face, Long neck, Fused fingers, Fused hands, Dismembered, Duplicate, Improper scale, Ugly body, Cloned face, Cloned body, Gross proportions, Body horror, Too many fingers, Cartoon, CGI, Render, 3D, Artwork, Illustration, 3D render, Cinema 4D, Artstation, Octane render, Painting, Oil painting, Anime, 2D, Sketch, Drawing, Bad photography, Bad photo, Deviant art, (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, UnrealisticDream, hoodie sweatshirt";

const NSFW_NEGATIVE_PROMPT = "Nsfw, Uncensored, Cleavage, Nude, Nipples";

const POSITIVE_PROMPT_DEFAULTS =
  "RAW photo, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3";

export const profileImagePromptCreation: MetaPromptType = createMetaPrompt({
  name: "ProfileImagePrompt",
  model: "GPT_FOUR",
  content: (params) => `
I need a prompt for a realistic profile picture, do not include hats or clothing
that obstructs the face. This should be a nearly straight on headshot image. Only
return a single string of the prompt, do not make image parameter reccomendations
outside of describing the person, it should be extremely detailed including
infomation on every datapoint:
${params.BaseAttributes}
${params.ExtendedAttributes.FaceAttributes}
${params.ExtendedAttributes.HairAttributes}
${params.ExtendedAttributes.EyesAttributes}
${params.ExtendedAttributes.BodyAttributes}
  `,
  params: {
    existingCharacters: [],
  },
});

export const profileImageCreation: MetaPromptType = createMetaPrompt({
  name: "ProfileImage",
  model: "SD",
  content: (params: Record<string, any>) => ({
    prompt: `${params.ProfileImagePrompt}, ${POSITIVE_PROMPT_DEFAULTS}`,
    negativePrompt: `${NEGATIVE_PROMPT_DEFAULTS}, ${NSFW_NEGATIVE_PROMPT}`,
    steps: 10,
    samplingMethod: "DPM++ SDE",
    scheduleType: "Karras",
    cfgScale: 1.5,
    width: 512,
    height: 512,
    restoreFaces: false,
    hires: {
      steps: 2,
      denoisingStrength: 0.35,
      upscaler: "ESRGAN_4x",
    },
  }),
  params: {
    existingCharacters: [],
  },
});
