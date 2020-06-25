import Stack from ".";

describe("A stack can", () => {
  test("push, pop, and clear", () => {
    console.error = jest.fn();

    const stack = new Stack<number>();

    stack.push(2);
    stack.push(3);
    stack.push(4);

    expect(stack.size()).toEqual(3);
    expect(stack.pop()).toEqual(4);
    expect(stack.size()).toEqual(2);
    expect(stack.pop()).toEqual(3);
    expect(stack.size()).toEqual(1);

    stack.clear();

    expect(stack.size()).toEqual(0);
    expect(stack.pop()).toEqual(null);
    expect(console.error).toHaveBeenCalledWith("Stack is empty");
  });
});
