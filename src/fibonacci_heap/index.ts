type compareFunc<T> = (a: T, b: T) => boolean;

const PHI = (Math.sqrt(5) + 1) / 2;

class FibonacciHeapNode<T> {
  degree: number;
  left: FibonacciHeapNode<T>;
  right: FibonacciHeapNode<T>;
  parent: FibonacciHeapNode<T> | null;
  children: FibonacciHeapNode<T>[];
  mark: boolean;
  key: T;

  constructor(key: T) {
    this.degree = 0;
    this.left = this;
    this.right = this;
    this.parent = null;
    this.children = [];
    this.mark = false;
    this.key = key;
  }

  toString(): string {
    return `key: ${this.key}, left: ${this.left.key}, right: ${
      this.right.key
      }, degree: ${this.degree}, parent: ${
      this.parent ? this.parent.key : null
      }, children: ${JSON.stringify(this.children.map(child => child.key))}`;
  }
}

class FibonacciHeap<T> {
  count: number;
  root: FibonacciHeapNode<T> | null;
  compareFunc: compareFunc<T>;

  constructor(compareFunc?: compareFunc<T>) {
    this.count = 0;
    this.root = null;
    this.compareFunc = compareFunc || ((a: T, b: T) => a < b);
  }

  private insertAt(
    position: FibonacciHeapNode<T> | null,
    node: FibonacciHeapNode<T>
  ) {
    if (position === null) {
      // The root list is empty
      this.root = node;
      node.left = node;
      node.right = node;
    } else {
      position.left.right = node;
      node.left = position.left;
      position.left = node;
      node.right = position;
    }
  }

  private removeAt(position: FibonacciHeapNode<T>) {
    position.left.right = position.right;
    position.right.left = position.left;
  }

  private upperLimit() {
    return Math.floor(Math.log(this.count) / Math.log(PHI));
  }

  private heapLink(y: FibonacciHeapNode<T>, x: FibonacciHeapNode<T>) {
    this.removeAt(y);
    y.left = y;
    y.right = y;
    y.parent = x;
    y.mark = false;
    x.children.push(y);
    x.degree++;
  }

  private consolidate() {
    // The root list has no more than one node, no need to consolidate.
    if (!this.root || this.root.right == this.root) return;

    const upperLimit = this.upperLimit();
    const auxillary: (FibonacciHeapNode<T> | null)[] = [];
    for (let i = 0; i <= upperLimit; ++i) {
      auxillary.push(null);
    }

    let current = this.root;
    const rootList = [];
    do {
      rootList.push(current);
      current = current.right;
    } while (current !== this.root);

    for (const current of rootList) {
      let x = current;
      let degree = x.degree;
      while (degree < upperLimit && auxillary[degree] !== null) {
        let y = auxillary[degree]!;
        if (this.compareFunc(y.key, x.key)) {
          let tmp = x;
          x = y;
          y = tmp;
        }
        this.heapLink(y, x);
        auxillary[degree] = null;
        degree++;
      }
      auxillary[degree] = x;
    };

    this.root = null;
    for (let i = 0; i <= upperLimit; ++i) {
      if (auxillary[i] !== null) {
        this.insertAt(this.root, auxillary[i]!);
        if (this.compareFunc(auxillary[i]!.key, this.root!.key)) {
          this.root = auxillary[i];
        }
      }
    }
  }

  dfs(node: FibonacciHeapNode<T>) {
    console.log(node.toString());
    for (const child of node.children) {
      this.dfs(child);
    }
  }

  debug() {
    console.log(`Current count: ${this.count}`);
    if (this.root === null) return;
    let current = this.root;
    do {
      this.dfs(current);
      current = current.right;
    } while (current !== this.root);
  }

  top(): T | null {
    return this.root ? this.root.key : null;
  }

  pop(): T | null {
    const top = this.root;
    if (top !== null) {
      for (const child of top.children) {
        this.insertAt(top, child);
        child.parent = null;
      }

      const isLast = top === top.right;
      this.removeAt(top);

      if (isLast) {
        this.root = null;
      } else {
        this.root = top.right;
        this.consolidate();
      }

      this.count--;
    }
    return top ? top.key : null;
  }

  insert(key: T) {
    const node = new FibonacciHeapNode(key);

    this.insertAt(this.root, node);
    if (this.compareFunc(node.key, this.root!.key)) {
      this.root = node;
    }

    this.count++;
  }

  union(that: FibonacciHeap<T>) {
    if (that.root == null) return;
    this.count += that.count;

    if (this.root == null) {
      this.root = that.root;
      return;
    }

    this.root.right.left = that.root.left;
    that.root.left.right = this.root.right;
    this.root.right = that.root;
    that.root.left = this.root;

    if (this.compareFunc(that.root.key, this.root.key)) {
      this.root = that.root;
    }
  }

  // TODO
  // decreaseKey() { }
}

export default FibonacciHeap;
