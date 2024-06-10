import { promises as fs } from "fs";
import * as path from "path";

import { runPrimeDynamic } from "./dynamics";

(async () => {
  const projectContextPath = path.join(__dirname, "..", "project.context");
  const readmeExamplePath = path.join(__dirname, "..", "readmeExample.context");

  const project = await fs.readFile(projectContextPath, "utf-8");
  const readmeExample = await fs.readFile(readmeExamplePath, "utf-8");

  const readmePlan = {
    project, //: project.slice(0, 1000),
    readmeExample, //: readmeExample.slice(0, 1000),
  };

  const result = await runPrimeDynamic(readmePlan);

  console.log({ result });

  // Assuming the structure of result.Write.Iterator
  // const paragraphs = [];
  // for (const [_, value] of Object.entries(result.iterated)) {
  //   // @ts-ignore
  //   if (value.Paragraph) {
  //     // @ts-ignore
  //     paragraphs.push(value.Paragraph);
  //   }
  // }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const tempFilePath = path.join(
    __dirname,
    "temp",
    `tempResult_${timestamp}.json`,
  );
  // const tempParagraphsFilePath = path.join(
  //   __dirname,
  //   "temp",
  //   `tempParagraphs_${timestamp}.json`,
  // );

  await fs.writeFile(tempFilePath, JSON.stringify(result, null, 2));
  // await fs.writeFile(tempParagraphsFilePath, paragraphs.join("\n"));

  // console.log(`Result saved to: ${tempFilePath}`);
  // console.log(`Paragraphs saved to: ${tempParagraphsFilePath}`);
})();
