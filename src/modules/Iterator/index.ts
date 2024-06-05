import { DynamicType } from "../../types";
import Dynamic from "../Dynamic";
import { useStore } from "../../store";

type IterationOptions = {
  iterations?: number;
  collectionKey?: () => string;
  collection?: any[];
};

export default function Iterator(
  items: (DynamicType | Record<string, DynamicType>)[],
  options: IterationOptions,
): DynamicType[] {
  const { iterations, collectionKey, collection } = options;
  const { getState } = useStore;

  let iterableCollection: any[] = [];

  if (collectionKey) {
    // Get the collection from the store using the collectionKey
    const state = getState();
    const dynamicCollection: [] = []; //state.generations[collectionKey()]?.iterated;

    if (dynamicCollection && Array.isArray(dynamicCollection)) {
      iterableCollection = dynamicCollection;
    } else {
      throw new Error(
        `Collection with key ${collectionKey()} not found or is not an array.`,
      );
    }
  } else if (collection) {
    // Use the provided collection
    if (Array.isArray(collection)) {
      iterableCollection = collection;
    } else {
      throw new Error("Provided collection is not an array.");
    }
  } else if (iterations !== undefined) {
    // Create a collection based on the number of iterations
    iterableCollection = Array.from({ length: iterations }, (_, i) => i + 1);
  } else {
    throw new Error(
      "Either iterations, collectionKey, or collection must be provided.",
    );
  }

  const instantiatedItems: DynamicType[] = items.map((item) => {
    if ("name" in item && "kind" in item) {
      return item as DynamicType;
    } else {
      const key = Object.keys(item)[0];
      const value = item[key];
      return Dynamic().create({ ...value, name: key });
    }
  });

  const iteratedItems: DynamicType[] = [];

  iterableCollection.forEach((iterationValue, index) => {
    instantiatedItems.forEach((item) => {
      const newItem = Dynamic().create({
        ...item,
        name: `${item.name}_iteration_${index + 1}`,
        iteratable: {
          iteration: index + 1,
          iterationValue,
        },
      });
      iteratedItems.push(newItem);
    });
  });

  return iteratedItems;
}
