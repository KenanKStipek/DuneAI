import { createMetaPrompt } from "../../../modules/MetaPrompt";
import type { MetaPromptType } from "../../../types";

export const bodyCreation: MetaPromptType = createMetaPrompt({
  name: "BodyAttributes",
  model: "NOUS_HERMES",
  content: (params) => `
  We are continuing a character profile creation. We have already defined this base information
  about them:
  ${params.BaseAttributes}

  Create a detailed description of their body, we don't need to include their name as it is
  implied in context, use measurements in millimeters as applicable. Complete this form,
  leave no blank, be succinct:
 	Neck Circumference:
	Neck Length:
	Neck Shape:
	Shoulder Width:
	Shoulder Height:
	Shoulder Slope:
	Chest Circumference:
	Bust Circumference:
	Bust Size:
	Bust Shape:
	Underbust Circumference:
	Nipple Size:
	Nipple Shape:
	Areola Size:
	Areola Shape:
	Rib Cage Circumference:
	Upper Back Width:
	Upper Back Length:
	Waist Circumference:
	Waist to Hip Ratio:
	Abdomen Circumference:
	Lower Back Width:
	Lower Back Length:
	Hip Circumference:
	Hip Width:
	Pelvic Tilt:
	Pelvic Width:
	Upper Arm Circumference:
	Upper Arm Length:
	Bicep Size:
	Tricep Size:
	Elbow Circumference:
	Elbow Shape:
	Forearm Circumference:
	Forearm Length:
	Wrist Circumference:
	Hand Size:
	Hand Length:
	Palm Width:
	Finger Length:
	Finger Circumference:
	Thumb Length:
	Thumb Circumference:
	Thigh Circumference:
	Thigh Length:
	Hamstring Size:
	Knee Circumference:
	Knee Shape:
	Calf Circumference:
	Calf Length:
	Shin Length:
	Ankle Circumference:
	Foot Length:
	Foot Width:
	Toe Length:
	Toe Circumference:
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
