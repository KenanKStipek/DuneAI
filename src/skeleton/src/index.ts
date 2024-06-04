import { runPrimeDynamic } from "./dynamics";

(async () => {
  const result = await runPrimeDynamic({
    genre: "fantasy",
    characterCount: 3,
    paragraphCount: 3,
  });
  console.log(result);
})();
