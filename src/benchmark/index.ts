import { suite, add, cycle, complete, save } from "benny";
import { ScapegoatTree, SplayTree } from "../";
import { randomInt } from "../common/helper";

enum OPERATION {
  SET,
  GET,
  ERASE,
}
interface Operation {
  type: OPERATION;
  key: number;
  value: number;
}
interface GenericMap {
  get: (key: any) => any | null;
  set: (key: any, value: any) => void;
  delete: (key: any) => void;
}
const generateRandomOperations = (num = 10000) => {
  const randomOperations: Operation[] = [];
  const aux = new Set<number>();
  for (let i = 0; i < num; ++i) {
    const rnd = randomInt(10);
    const type =
      rnd < 2 && aux.size > 0
        ? OPERATION.ERASE
        : rnd < 5
        ? OPERATION.GET
        : OPERATION.SET;
    const key =
      type === OPERATION.ERASE
        ? Array.from(aux)[randomInt(aux.size)]
        : randomInt(100000);
    const value = randomInt(100000);
    if (type === OPERATION.ERASE) aux.delete(key);
    randomOperations.push({
      type,
      key,
      value,
    });
  }
  return randomOperations;
};
const randomOperations = generateRandomOperations();

const testMapImplementations = (cases: { name: string; map: GenericMap }[]) =>
  cases.map(({ name, map }) => {
    return add(name, () => {
      for (let { type, key, value } of randomOperations) {
        switch (type) {
          case OPERATION.GET:
            map.get(key);
            break;
          case OPERATION.SET:
            map.set(key, value);
            break;
          default:
            map.delete(key);
        }
      }
    });
  });

suite(
  "Random operations",
  ...testMapImplementations([
    ...[0.6, 0.7, 0.8].map((alpha) => ({
      name: `ScapegoatTree-${alpha}`,
      map: new ScapegoatTree<number, number>(alpha),
    })),
    { name: "SplayTree", map: new SplayTree<number, number>() },
    { name: "Map", map: new Map<number, number>() },
  ]),
  cycle(),
  complete()
);
