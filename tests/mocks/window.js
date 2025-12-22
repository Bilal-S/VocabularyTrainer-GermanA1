/**
 * Window mock for Node.js testing environment
 */
export class WindowMock {
  constructor() {
    this.location = {
      href: '',
      origin: 'http://localhost:3000'
    }
    this.navigator = {
      userAgent: 'Node.js Test Environment'
    }
    this.URL = class URL {
      constructor(url) {
        this.href = url
        this.origin = 'http://localhost:3000'
        this.search = ''
        this.searchParams = new Map()
      }
    }
    this.Blob = class Blob {
      constructor(content, options) {
        this.content = content
        this.type = options?.type || ''
      }
    }
    this.URL.createObjectURL = () => 'mock-url'
    this.URL.revokeObjectURL = () => {}
    
    // Mock matchMedia for PWA detection
    this.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    })
  }
}

// Install mock globally
global.window = new WindowMock()
global.URL = global.window.URL
global.Blob = global.window.Blob
