import ScapegoatTree from ".";
import { randomInt } from "../common/helper";

describe("Test", () => {
  test("invalid alpha", () => {
    expect(() => new ScapegoatTree(0.59)).toThrowError(
      "Valid alpha is 0.6--0.8."
    );
    expect(() => new ScapegoatTree(0.81)).toThrowError(
      "Valid alpha is 0.6--0.8."
    );
  });

  test("fixed operations", () => {
    let st = new ScapegoatTree<number, number>();
    st.set(10, 2);
    st.set(8, 3);

    expect(st.size()).toEqual(2);

    st.delete(8);

    expect(st.size()).toEqual(1);

    st.delete(9);
    st.delete(10);

    expect(st.empty()).toBeTruthy;
    expect(st.keys()).toEqual([]);

    st.set(8, -23);
    st.set(9, 1);
    st.set(10, 5);

    expect(st.size()).toEqual(3);
    expect(st.get(10)).toEqual(5);
    expect(st.keys()).toEqual([8, 9, 10]);
    expect(st.values()).toEqual([-23, 1, 5]);

    st.clear();
    expect(st.empty()).toBeTruthy;
    expect(st.keys()).toEqual([]);
  });

  test("random operations", () => {
    let st = new ScapegoatTree<number, number>();
    let aux = new Map<number, number>();
    for (let i = 0; i < 10000; ++i) {
      let key = randomInt();
      let value = randomInt();
      aux.set(key, value);
      st.set(key, value);
      if (st.size() > 1000) {
        let keys = Array.from(aux.keys());
        if (randomInt() > 5000) {
          let toDel = keys[randomInt(keys.length)];
          st.delete(toDel);
          aux.delete(toDel);
        }
      }
    }
    for (let key of aux.keys()) {
      expect(aux.get(key)).toEqual(st.get(key));
    }
    st.clear();
    aux.clear();
  });
});
