import { runPrimeDynamic } from "./dynamics";

(async () => {
  const result = await runPrimeDynamic({
    genre: "fantasy",
    characterCount: 5,
    totalPageLength: 20,
  });
  console.log(result);
})();
