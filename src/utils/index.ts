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
