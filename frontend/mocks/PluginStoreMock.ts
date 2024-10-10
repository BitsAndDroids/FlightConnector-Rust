export class Store {
  constructor() {
    this.store = {};
  }
  set(key, value) {
    this.store[key] = value;
  }
  get(key) {
    return this.store[key];
  }
  delete(key) {
    delete this.store[key];
  }
  keys() {
    return Object.keys(this.store);
  }
  save() {
    return;
  }
}
