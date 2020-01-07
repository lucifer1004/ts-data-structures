class Stack<T> {
  private elements: T[];

  constructor() {
    this.elements = [];
  }

  clear() {
    this.elements = [];
  }

  empty(): boolean {
    return this.elements.length === 0;
  }

  push(element: T) {
    this.elements.push(element);
  }

  top(): T | null {
    if (this.empty()) {
      console.error("Stack is empty");
      return null;
    }
    return this.elements[this.elements.length - 1];
  }

  pop(): T | null {
    const top = this.top();
    if (top !== null) {
      this.elements.splice(this.elements.length - 1, 1);
    }
    return top;
  }
}

export default Stack;
