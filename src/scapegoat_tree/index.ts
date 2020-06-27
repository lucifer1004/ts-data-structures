import { CompareFunc } from "../common/types";

class ScapegoatTreeNode<K, V> {
  left: ScapegoatTreeNode<K, V> | null;
  right: ScapegoatTreeNode<K, V> | null;
  parent: ScapegoatTreeNode<K, V> | null;
  size: number;
  key: K;
  value: V;
  deleted: boolean;

  constructor(key: K, value: V) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.key = key;
    this.value = value;
    this.size = 1;
    this.deleted = false;
  }
}

export default class ScapegoatTree<K, V> {
  root: ScapegoatTreeNode<K, V> | null;
  alpha: number;
  count: number;
  compareFunc: CompareFunc<K>;
  private isImbalanced(node: ScapegoatTreeNode<K, V>): boolean {
    if (node.left && node.left.size > this.alpha * node.size) return true;
    if (node.right && node.right.size > this.alpha * node.size) return true;
    return false;
  }

  private find(key: K): ScapegoatTreeNode<K, V> | null {
    let curr = this.root;
    while (curr) {
      if (this.compareFunc(curr.key, key)) curr = curr.right;
      else if (this.compareFunc(key, curr.key)) curr = curr.left;
      else return curr;
    }
    return null;
  }

  private dfs(u: ScapegoatTreeNode<K, V> | null, entries: [K, V][]) {
    if (!u) {
      return;
    }
    u.left && this.dfs(u.left, entries);
    if (!u.deleted) {
      entries.push([u.key, u.value]);
    }
    u.right && this.dfs(u.right, entries);
  }

  private generateSubtreeFromNodes(
    nodes: [K, V][],
    l: number,
    r: number
  ): ScapegoatTreeNode<K, V> | null {
    if (l > r) {
      return null;
    }
    const mid = (l + r) >> 1;
    const subtreeRoot = new ScapegoatTreeNode(nodes[mid][0], nodes[mid][1]);
    const left = this.generateSubtreeFromNodes(nodes, l, mid - 1);
    const right = this.generateSubtreeFromNodes(nodes, mid + 1, r);
    if (left) {
      subtreeRoot.left = left;
      left.parent = subtreeRoot;
    }
    if (right) {
      subtreeRoot.right = right;
      right.parent = subtreeRoot;
    }
    return subtreeRoot;
  }

  private reconstruct(node: ScapegoatTreeNode<K, V>) {
    const nodes: [K, V][] = [];
    this.dfs(node, nodes);
    const subtreeRoot = this.generateSubtreeFromNodes(
      nodes,
      0,
      nodes.length - 1
    );
    subtreeRoot!!.parent = node.parent;
    if (!node.parent) {
      this.root = subtreeRoot;
    } else if (node === node.parent.left) {
      node.parent.left = subtreeRoot;
    } else {
      node.parent.right = subtreeRoot;
    }
  }

  constructor(alpha = 0.7, compareFunc?: CompareFunc<K>) {
    if (alpha < 0.6 || alpha > 0.8) throw new Error("Valid alpha is 0.6--0.8.");
    this.alpha = alpha;
    this.root = null;
    this.count = 0;
    this.compareFunc = (a: K, b: K) => {
      if (compareFunc) return compareFunc(a, b);
      else return a < b;
    };
  }

  empty(): boolean {
    return this.count === 0;
  }

  size(): number {
    return this.count;
  }

  clear() {
    this.root = null;
    this.count = 0;
  }

  entries(): [K, V][] {
    const entries: [K, V][] = [];
    this.dfs(this.root, entries);
    return entries;
  }

  keys() {
    return this.entries().map((entry) => entry[0]);
  }

  values() {
    return this.entries().map((entry) => entry[1]);
  }

  get(key: K): V | null {
    let node = this.find(key);
    return node && !node.deleted ? node.value : null;
  }

  set(key: K, value: V) {
    let curr = this.root;
    let p = null;
    const path = [];
    while (curr) {
      p = curr;
      path.push(p);
      if (this.compareFunc(curr.key, key)) {
        curr = curr.right;
      } else if (this.compareFunc(key, curr.key)) {
        curr = curr.left;
      } else {
        curr.value = value;
        if (curr.deleted) {
          this.count++;
          curr.deleted = false;
        }
        return;
      }
    }
    this.count++;
    let node = new ScapegoatTreeNode(key, value);
    node.parent = p;
    if (!p) {
      this.root = node;
    } else if (this.compareFunc(p.key, key)) {
      p.right = node;
    } else {
      p.left = node;
    }
    for (let anc of path) {
      if (this.isImbalanced(anc)) {
        this.reconstruct(anc);
        return;
      }
    }
  }

  delete(key: K) {
    let node = this.find(key);
    if (!node) {
      return;
    }
    if (!node.deleted) {
      this.count--;
      node.deleted = true;
    }
  }
}
