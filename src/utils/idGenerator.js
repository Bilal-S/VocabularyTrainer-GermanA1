// Unique ID generator to avoid duplicate keys
let messageIdCounter = 0

export const generateMessageId = () => {
  const timestamp = Date.now()
  const counter = ++messageIdCounter
  return `${timestamp}-${counter}`
}
