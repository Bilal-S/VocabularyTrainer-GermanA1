/**
 * localStorage mock for Node.js testing environment
 */
export class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = value.toString()
  }

  removeItem(key) {
    delete this.store[key]
  }

  clear() {
    this.store = {}
  }

  get length() {
    return Object.keys(this.store).length
  }

  key(index) {
    return Object.keys(this.store)[index] || null
  }
}

// Install mock globally
global.localStorage = new LocalStorageMock()
