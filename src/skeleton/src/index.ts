import { runPrimeDynamic } from "./dynamics";

(async () => {
  const completion = await runPrimeDynamic();
  // const completion = await action.run()

  console.log(completion);
})();
