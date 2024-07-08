import { runDynamic } from "./dynamics";

(async () => {
  const result = await runDynamic();
  const values = Object.values(result);
  values.forEach((v) => console.log(v, "\n"));
})();
