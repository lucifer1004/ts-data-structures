import FibonacciHeap from ".";

describe("Test top", () => {
  test("In an empty heap", () => {
    const heap = new FibonacciHeap();

    expect(heap.top()).toEqual(null);
  })

  test("In a min-heap", () => {
    const heap = new FibonacciHeap();

    heap.insert(3);
    heap.insert(12);

    expect(heap.top()).toEqual(3);
  });

  test("In a max-heap", () => {
    const heap = new FibonacciHeap((a: number, b: number) => a > b);

    heap.insert(3);
    heap.insert(12);

    expect(heap.top()).toEqual(12);
  });
})



describe("Union of two min-heaps", () => {
  test("when current heap is empty", () => {
    const a = new FibonacciHeap();

    const b = new FibonacciHeap();
    b.insert(2);
    b.insert(1);

    a.union(b);
    expect(a.top()).toEqual(1);
  });

  test("when the other heap is empty", () => {
    const a = new FibonacciHeap();
    a.insert(3);
    a.insert(12);

    const b = new FibonacciHeap();

    a.union(b);
    expect(a.top()).toEqual(3);
  });

  test("when both heaps have values", () => {
    const a = new FibonacciHeap();
    a.insert(3);
    a.insert(12);

    const b = new FibonacciHeap();
    b.insert(24);
    b.insert(15);

    a.union(b);
    expect(a.top()).toEqual(3);
  });

  test("when both heaps have values, and top changes", () => {
    const a = new FibonacciHeap();
    a.insert(3);
    a.insert(12);

    const b = new FibonacciHeap();
    b.insert(2);
    b.insert(1);

    a.union(b);
    expect(a.top()).toEqual(1);
  });
});

test("Pop from min-heap", () => {
  for (let t = 0; t < 10; ++t) {
    const num = 10 + (0 | Math.random() * 50);
    const heap = new FibonacciHeap();
    let randomNumbers = [];
    for (let i = 0; i < num; ++i) {
      const n = 0 | (Math.random() * 200);
      heap.insert(n);
      randomNumbers.push(n);
    }
    randomNumbers.sort((a, b) => a - b);
    for (let i = 0; i < num; ++i) {
      expect(heap.pop()).toEqual(randomNumbers[i]);
    }
    expect(heap.pop()).toEqual(null);
  }
});

describe("Debug", () => {
  beforeAll(() => {
    console.log = jest.fn();
  })

  test("An empty heap", () => {
    const heap = new FibonacciHeap();
    heap.debug();
    expect(console.log).toHaveBeenCalledWith("Current count: 0");
  })

  test("", () => {
    const heap = new FibonacciHeap();
    heap.insert(3);
    heap.insert(12);
    heap.insert(4);
    heap.pop();
    heap.debug();
    expect(console.log).toHaveBeenCalledWith("Current count: 2");
    expect(console.log).toHaveBeenCalledWith(
      "key: 4, left: 4, right: 4, degree: 1, parent: null, children: [12]"
    );
    expect(console.log).toHaveBeenCalledWith(
      "key: 12, left: 12, right: 12, degree: 0, parent: 4, children: []"
    );
  })

});
