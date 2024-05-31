import path from "path";
import fs from "fs";

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const retryOperation = (
  operation: any,
  delay: number,
  retries: number,
) =>
  new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason: string) => {
        if (retries > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });

export const shuffle = (array: string[][]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const importPrompt = (filePath: string): string => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(absolutePath, "utf8");
};

export const importPrompts = (
  filePaths: string | string[],
): Record<string, string> => {
  const prompts: Record<string, string> = {};

  if (typeof filePaths === "string") {
    const fileName = path.basename(filePaths, path.extname(filePaths));
    prompts[fileName] = importPrompt(filePaths);
  } else {
    filePaths.forEach((filePath) => {
      const fileName = path.basename(filePath, path.extname(filePath));
      prompts[fileName] = importPrompt(filePath);
    });
  }

  return prompts;
};
