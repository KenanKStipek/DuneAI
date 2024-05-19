import { createDynamic, COT, TOT } from "../../../";
import {
  baseCreation,
  faceCreation,
  bodyCreation,
  intimateCreation,
  packBase,
  packExtended,
  packExtendedIntimate,
  profileImagePromptCreation,
  profileImageCreation,
} from "../metaPrompts";

export const extendedProfile = createDynamic({
  name: "ExtendedAttributes",
  kind: TOT,
  metaPrompts: [faceCreation, bodyCreation, intimateCreation],
});

export const image = createDynamic({
  name: "ProfileImage",
  kind: COT,
  metaPrompts: [profileImagePromptCreation, profileImageCreation],
});

export const packageJSON = createDynamic({
  name: "jsonData",
  kind: TOT,
  metaPrompts: [packBase, packExtended, packExtendedIntimate],
});

export const getPrimeDynamic = (params: any) =>
  createDynamic({
    name: "Character",
    kind: COT,
    params,
    metaPrompts: [baseCreation],
    dynamics: [extendedProfile, image],
  });

export async function runPrimeDynamic(params: {
  genre?: string;
  characterCount?: number;
  totalPageLength?: number;
}) {
  console.log("Starting the profile creation process...");

  const prime = getPrimeDynamic(params);
  return await prime.run(prime);
}
