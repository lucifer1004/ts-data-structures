import { CompareFunc } from "../common/types";

class SplayTreeNode<K, V> {
  left: SplayTreeNode<K, V> | null;
  right: SplayTreeNode<K, V> | null;
  parent: SplayTreeNode<K, V> | null;
  key: K;
  value: V;

  constructor(key: K, value: V) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.key = key;
    this.value = value;
  }
}

export default class SplayTree<K, V> {
  root: SplayTreeNode<K, V> | null;
  compareFunc: CompareFunc<K>;
  count: number;

  private leftRotate(x: SplayTreeNode<K, V>) {
    let y = x.right;
    x.right = y ? y.left : null;
    if (y && y.left) {
      y.left.parent = x;
    }
    y && (y.parent = x.parent);
    if (x.parent) {
      if (x === x.parent.left) x.parent.left = y;
      else x.parent.right = y;
    }
    y && (y.left = x);
    x.parent = y;
  }

  private rightRotate(x: SplayTreeNode<K, V>) {
    let y = x.left;
    x.left = y ? y.right : null;
    if (y && y.right) {
      y.right.parent = x;
    }
    y && (y.parent = x.parent);
    if (x.parent) {
      if (x === x.parent.left) x.parent.left = y;
      else x.parent.right = y;
    }
    y && (y.right = x);
    x.parent = y;
  }

  private splay(x: SplayTreeNode<K, V>) {
    while (x.parent) {
      if (!x.parent.parent) {
        if (x === x.parent.left) this.rightRotate(x.parent);
        else this.leftRotate(x.parent);
      } else if (x === x.parent.left && x.parent === x.parent.parent.left) {
        this.rightRotate(x.parent.parent);
        this.rightRotate(x.parent);
      } else if (x === x.parent.right && x.parent === x.parent.parent.right) {
        this.leftRotate(x.parent.parent);
        this.leftRotate(x.parent);
      } else if (x === x.parent.left && x.parent === x.parent.parent.right) {
        this.rightRotate(x.parent);
        this.leftRotate(x.parent);
      } else {
        this.leftRotate(x.parent);
        this.rightRotate(x.parent);
      }
    }
    this.root = x;
  }

  private replace(u: SplayTreeNode<K, V>, v: SplayTreeNode<K, V> | null) {
    if (!u.parent) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v) {
      v.parent = u.parent;
    }
  }

  private find(key: K): SplayTreeNode<K, V> | null {
    let curr = this.root;
    while (curr) {
      if (this.compareFunc(curr.key, key)) {
        curr = curr.right;
      } else if (this.compareFunc(key, curr.key)) {
        curr = curr.left;
      } else {
        return curr;
      }
    }
    return null;
  }

  private subMin(u: SplayTreeNode<K, V> | null): SplayTreeNode<K, V> | null {
    while (u && u.left) {
      u = u.left;
    }
    return u;
  }

  private subMax(u: SplayTreeNode<K, V> | null): SplayTreeNode<K, V> | null {
    while (u && u.right) {
      u = u.right;
    }
    return u;
  }

  private dfs(u: SplayTreeNode<K, V> | null, entries: [K, V][]) {
    if (!u) {
      return;
    }
    if (u.left) {
      this.dfs(u.left, entries);
    }
    entries.push([u.key, u.value]);
    if (u.right) {
      this.dfs(u.right, entries);
    }
  }

  constructor(compareFunc?: CompareFunc<K>) {
    this.root = null;
    this.count = 0;
    this.compareFunc = (a: K, b: K) => {
      if (compareFunc) return compareFunc(a, b);
      else return a < b;
    };
  }

  size(): number {
    return this.count;
  }

  empty(): boolean {
    return this.count === 0;
  }

  clear() {
    this.root = null;
    this.count = 0;
  }

  get(key: K): V | null {
    let node = this.find(key);
    return node ? node.value : null;
  }

  set(key: K, value: V) {
    let curr = this.root;
    let p = null;
    while (curr) {
      p = curr;
      if (this.compareFunc(curr.key, key)) {
        curr = curr.right;
      } else if (this.compareFunc(key, curr.key)) {
        curr = curr.left;
      } else {
        curr.value = value;
        return;
      }
    }
    let node = new SplayTreeNode(key, value);
    node.parent = p;
    if (!p) {
      this.root = node;
    } else if (this.compareFunc(p.key, key)) {
      p.right = node;
    } else {
      p.left = node;
    }
    this.splay(node);
    this.count++;
  }

  delete(key: K) {
    let node = this.find(key);
    if (!node) {
      return;
    }
    this.splay(node);
    if (!node.left) {
      this.replace(node, node.right);
    } else if (!node.right) {
      this.replace(node, node.left);
    } else {
      let rmin = this.subMin(node.right);
      if (rmin) {
        if (rmin.parent != node) {
          this.replace(rmin, rmin.right);
          rmin.right = node.right;
          rmin.right.parent = rmin;
        }
        this.replace(node, rmin);
        rmin.left = node.left;
        rmin.left.parent = rmin;
      }
    }
    this.count--;
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

  min(): SplayTreeNode<K, V> | null {
    return this.subMin(this.root);
  }

  max(): SplayTreeNode<K, V> | null {
    return this.subMax(this.root);
  }
}
