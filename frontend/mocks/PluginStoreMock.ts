export class LazyStore {
  store: any;
  constructor() {
    this.store = {};
  }
  has(key: string | number) {
    return key in this.store;
  }
  set(key: string | number, value: any) {
    this.store[key] = value;
  }
  get(key: string | number) {
    return this.store[key];
  }
  delete(key: string | number) {
    delete this.store[key];
  }
  keys() {
    return Object.keys(this.store);
  }
  save() {
    return;
  }
}
