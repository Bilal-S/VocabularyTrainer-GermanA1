/**
 * Document mock for Node.js testing environment
 */
export class DocumentMock {
  constructor() {
    this.body = {
      appendChild: () => {},
      removeChild: () => {}
    }
  }

  createElement(tagName) {
    return {
      tagName: tagName.toUpperCase(),
      href: '',
      download: '',
      style: {},
      click: () => {},
      appendChild: () => {},
      removeChild: () => {},
      setAttribute: () => {},
      getAttribute: () => null
    }
  }

  createElementNS() {
    return this.createElement()
  }

  createTextNode() {
    return {
      nodeValue: '',
      appendChild: () => {},
      removeChild: () => {}
    }
  }
}

// Install mock globally
global.document = new DocumentMock()
