import { runPrimeDynamic } from "./dynamics";
import fs from "fs";
import os from "os";
import path from "path";
import axios from "axios";
import { getXataClient } from "./xata";

const xata = getXataClient();

// Function to decode base64 string and write it to a file
// @ts-ignore
const saveBase64Image = (base64String, filePath) => {
  const buffer = Buffer.from(base64String, "base64");
  fs.writeFileSync(filePath, buffer);
};

// Function to extract fields from the object
// @ts-ignore
const extractFields = (obj) => {
  let base, body, hair, face, eyes, intimate;
  try {
    base = JSON.parse(obj.base);
  } catch (error) {
    console.error("Error parsing base JSON:", error);
  }
  try {
    body = JSON.parse(obj.body);
  } catch (error) {
    console.error("Error parsing body JSON:", error);
  }
  try {
    hair = JSON.parse(obj.hair);
  } catch (error) {
    console.error("Error parsing hair JSON:", error);
  }
  try {
    eyes = JSON.parse(obj.eyes);
  } catch (error) {
    console.error("Error parsing eyes JSON:", error);
  }
  try {
    face = JSON.parse(obj.face);
  } catch (error) {
    console.error("Error parsing face JSON:", error);
  }
  try {
    intimate = JSON.parse(obj.intimate);
  } catch (error) {
    console.error("Error parsing intimate JSON:", error);
  }

  return {
    name: base?.full_name || "",
    bio: base?.bio || "",
    username: base?.username || "",
    meta: {
      base: base || {},
      body: body || {},
      face: face || {},
      hair: hair || {},
      eyes: eyes || {},
      intimate: intimate || {},
    },
  };
};

// Function to upload the profile image
// @ts-ignore
const uploadProfileImage = async (uploadUrl, imagePath) => {
  const imageData = fs.readFileSync(imagePath);
  await axios.put(uploadUrl, imageData, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};

// Function to fetch a random sample of profiles from Xata
const fetchRandomProfiles = async (sampleSize = 4) => {
  // @ts-ignore
  const allProfiles = await xata.db.Profiles.getAll();
  const shuffled = allProfiles.sort(() => 0.5 - Math.random());
  // @ts-ignore
  return shuffled.slice(0, sampleSize).map((profile) => ({
    name: profile.name,
    username: profile.username,
    meta: {
      base: profile.meta.base,
    },
  }));
};

(async () => {
  const iterations = 500; // Set the number of iterations
  for (let i = 0; i < iterations; i++) {
    try {
      // Fetch a random sample of profiles
      const sampleProfiles = (await fetchRandomProfiles()).map(
        (p) => p.meta.base,
      );

      // Run `runPrimeDynamic` with sampled profiles as existingCharacters
      const result = await runPrimeDynamic({
        // @ts-ignore
        existingCharacters: sampleProfiles,
      });

      // Extract the specific JSON values
      const extractedJson = {
        // @ts-ignore
        base: result.Character.jsonData.JSON_BASE,
        // @ts-ignore
        body: result.Character.jsonData.JSON_EXTENDED_BODY,
        // @ts-ignore
        face: result.Character.jsonData.JSON_EXTENDED_FACE,
        // @ts-ignore
        hair: result.Character.jsonData.JSON_EXTENDED_HAIR,
        // @ts-ignore
        eyes: result.Character.jsonData.JSON_EXTENDED_EYES,
        // @ts-ignore
        intimate: result.Character.jsonData.JSON_EXTENDED_INTIMATE,
      };

      const fields = extractFields(extractedJson);
      const jsonResult = JSON.stringify(extractedJson, null, 2);

      // Generate unique temporary file paths
      const tempJsonFilePath = path.join(os.tmpdir(), `result_${i}.json`);
      const tempImageFilePath = path.join(
        os.tmpdir(),
        `profile_image_${i}.png`,
      );

      // Extract base64 image string
      // @ts-ignore
      const base64Image = result.Character.ProfileImage.ProfileImage.images[0];

      // Write the JSON result to the temporary file
      fs.writeFileSync(tempJsonFilePath, jsonResult);

      // Save the image to the temporary file
      saveBase64Image(base64Image, tempImageFilePath);

      console.log(`JSON result saved to ${tempJsonFilePath}`);
      console.log(`Profile image saved to ${tempImageFilePath}`);

      // Create the new profile in Xata without the image and request an upload URL
      // @ts-ignore
      const profile = await xata.db.Profiles.create(
        {
          name: fields.name,
          bio: fields.bio,
          username: fields.username,
          avatar: {
            name: `profile_image_${i}.png`,
            mediaType: "image/png",
            base64Content: "",
          },
          meta: fields.meta,
        },
        ["avatar.uploadUrl"],
      );

      // Upload the profile image to the returned upload URL
      const uploadUrl = profile?.avatar?.uploadUrl;
      if (uploadUrl) {
        await uploadProfileImage(uploadUrl, tempImageFilePath);
      }

      console.log(
        `Iteration ${i + 1}: Profile created and image uploaded successfully.`,
      );
    } catch (error) {
      console.error(`Iteration ${i + 1}: An error occurred:`, error);
    }
  }
})();
