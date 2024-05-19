import { runPrimeDynamic } from "./dynamics";

(async () => {
  const result = await runPrimeDynamic({
    genre: "fantasy",
    characterCount: 5,
    totalPageLength: 3,
  });
  console.log(JSON.stringify(result, null, 2));
})();
