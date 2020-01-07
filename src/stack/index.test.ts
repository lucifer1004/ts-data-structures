import Stack from ".";

describe("A stack can", () => {
  test("push, pop, and clear", () => {
    console.error = jest.fn();

    const stack = new Stack<number>();

    stack.push(2);
    stack.push(3);
    stack.push(4);

    expect(stack.pop()).toEqual(4);
    expect(stack.pop()).toEqual(3);

    stack.clear();

    expect(stack.pop()).toEqual(null);
    expect(console.error).toHaveBeenCalledWith("Stack is empty");
  });
});
