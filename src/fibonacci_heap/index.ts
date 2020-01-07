type compareFunc<T> = (a: T, b: T) => boolean;

const PHI = (Math.sqrt(5) + 1) / 2;

class FibonacciHeapNode<T> {
  left: FibonacciHeapNode<T>;
  right: FibonacciHeapNode<T>;
  parent: FibonacciHeapNode<T> | null;
  children: FibonacciHeapNode<T>[];
  mark: boolean;
  key: T;

  constructor(key: T) {
    this.left = this;
    this.right = this;
    this.parent = null;
    this.children = [];
    this.mark = false;
    this.key = key;
  }

  degree(): number {
    return this.children.length;
  }

  toString(): string {
    return `key: ${this.key}, left: ${this.left.key}, right: ${
      this.right.key
    }, degree: ${this.degree()}, parent: ${
      this.parent ? this.parent.key : null
    }, children: ${JSON.stringify(this.children.map(child => child.key))}`;
  }
}

class FibonacciHeap<T> {
  count: number;
  private root: FibonacciHeapNode<T> | null;
  compareFunc: compareFunc<T>;

  constructor(compareFunc?: compareFunc<T>) {
    this.count = 0;
    this.root = null;
    this.compareFunc = (a: T, b: T) => {
      if (a === null) return true;
      if (compareFunc) return compareFunc(a, b);
      else return a < b;
    };
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
      let degree = x.degree();
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
    }

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

  private cut(node: FibonacciHeapNode<T>, parent: FibonacciHeapNode<T>) {
    const index = parent.children.findIndex(child => child === node);
    parent.children.splice(index, 1);
    node.parent = null;
    node.mark = false;
  }

  private cascadingCut(node: FibonacciHeapNode<T>) {
    const parent = node.parent;
    if (parent !== null) {
      if (node.mark === false) {
        node.mark = true;
      } else {
        this.cut(node, parent);
        this.cascadingCut(parent);
      }
    }
  }

  private dfs(node: FibonacciHeapNode<T>) {
    console.log(node.toString());
    for (const child of node.children) {
      this.dfs(child);
    }
  }

  empty(): boolean {
    return this.root === null;
  }

  clear() {
    this.root = null;
    this.count = 0;
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

  push(key: T): FibonacciHeapNode<T> {
    const node = new FibonacciHeapNode(key);

    this.insertAt(this.root, node);
    if (this.compareFunc(node.key, this.root!.key)) {
      this.root = node;
    }

    this.count++;

    return node;
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

  decreaseKey(node: FibonacciHeapNode<T>, newKey: T) {
    if (this.compareFunc(node.key, newKey)) {
      console.error("New key is invalid.");
      return;
    }

    node.key = newKey;
    const parent = node.parent;
    if (parent !== null && this.compareFunc(node.key, parent.key)) {
      this.cut(node, parent);
      this.cascadingCut(parent);
    }

    if (this.compareFunc(node.key, this.root!.key)) {
      this.root = node;
    }
  }

  remove(node: FibonacciHeapNode<T>) {
    if (node.key === null) return;
    this.decreaseKey(node, (null as unknown) as T);
    this.pop();
  }
}

export default FibonacciHeap;
