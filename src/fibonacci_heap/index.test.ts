import FibonacciHeap from ".";

describe("Test top", () => {
  test("In an empty heap", () => {
    const heap = new FibonacciHeap<number>();

    expect(heap.top()).toEqual(null);
  });

  test("In a min-heap", () => {
    const heap = new FibonacciHeap<number>();

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
});

describe("Union of two min-heaps", () => {
  test("when current heap is empty", () => {
    const a = new FibonacciHeap<number>();

    const b = new FibonacciHeap<number>();
    b.insert(2);
    b.insert(1);

    a.union(b);
    expect(a.top()).toEqual(1);
  });

  test("when the other heap is empty", () => {
    const a = new FibonacciHeap<number>();
    a.insert(3);
    a.insert(12);

    const b = new FibonacciHeap<number>();

    a.union(b);
    expect(a.top()).toEqual(3);
  });

  test("when both heaps have values", () => {
    const a = new FibonacciHeap<number>();
    a.insert(3);
    a.insert(12);

    const b = new FibonacciHeap<number>();
    b.insert(24);
    b.insert(15);

    a.union(b);
    expect(a.top()).toEqual(3);
  });

  test("when both heaps have values, and top changes", () => {
    const a = new FibonacciHeap<number>();
    a.insert(3);
    a.insert(12);

    const b = new FibonacciHeap<number>();
    b.insert(2);
    b.insert(1);

    a.union(b);
    expect(a.top()).toEqual(1);
  });
});

test("Pop from min-heap", () => {
  for (let t = 0; t < 10; ++t) {
    const num = 10 + (0 | (Math.random() * 50));
    const heap = new FibonacciHeap<number>();
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

describe("Decrease key", () => {
  test("Invalidly", () => {
    console.error = jest.fn();
    const heap = new FibonacciHeap<number>();
    const node = heap.insert(1);
    heap.decreaseKey(node, 2);
    expect(console.error).toHaveBeenCalledWith('New key is invalid.');
  })

  test("Of root", () => {
    const heap = new FibonacciHeap<number>();
    const node = heap.insert(1);
    heap.decreaseKey(node, 0);
    expect(heap.top()).toEqual(0);
  })

  test("Of non-root", () => {
    const heap = new FibonacciHeap<number>();
    const nodes = [];
    for (let i = 10; i <= 20; ++i) {
      const node = heap.insert(i);
      if (i > 10) nodes.push(node);
    }
    expect(heap.pop()).toEqual(10);
    
    for (let i = 9; i >= 0; --i) {
      heap.decreaseKey(nodes[i], i);
      expect(heap.top()).toEqual(i);
    }
  })
})

describe("Remove", () => {
  test("Root", () => {
    const heap = new FibonacciHeap<number>();
    const node = heap.insert(1);
    heap.insert(2);
    heap.remove(node);
    expect(heap.top()).toEqual(2);
  })

  test("A non-root node", () => {
    const heap = new FibonacciHeap<number>();
    const node = heap.insert(2);
    heap.insert(1);
    heap.remove(node);
    expect(heap.top()).toEqual(1);
  })
})

describe("Debug", () => {
  beforeAll(() => {
    console.log = jest.fn();
  });

  test("An empty heap", () => {
    const heap = new FibonacciHeap<number>();
    heap.debug();
    expect(console.log).toHaveBeenCalledWith("Current count: 0");
  });

  test("An ordinary heap", () => {
    const heap = new FibonacciHeap<number>();
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
  });
});
