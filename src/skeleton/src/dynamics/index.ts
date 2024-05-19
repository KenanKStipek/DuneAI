import { createDynamic, COT, TOT } from "../../../";
import { baseCreation, faceCreation, bodyCreation } from "../metaPrompts";

export const extendedProfile = createDynamic({
  name: "ExtendedCharacter",
  kind: TOT,
  metaPrompts: [faceCreation, bodyCreation],
});

//TODO///////

// NEED TO FIX HOW CREATED VALUES ARE NOT PASSING BETWEEN DYNAMICS AND METAPROMPTS <-----

export const getPrimeDynamic = (params: any) =>
  createDynamic({
    name: "Character",
    kind: COT,
    params,
    metaPrompts: [baseCreation],
    dynamics: [extendedProfile],
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
