// Vocabulary loader for alphabet-based A1 German vocabulary
// Dynamically imports all letter files and provides unified access

// Import all letter files
import { letterA } from './a.js'
import { letterB } from './b.js'
import { letterC } from './c.js'
import { letterD } from './d.js'
import { letterE } from './e.js'
import { letterF } from './f.js'
import { letterG } from './g.js'
import { letterH } from './h.js'
import { letterI } from './i.js'
import { letterJ } from './j.js'
// Note: This will be expanded to include all letters A-Z

// For now, we'll create a partial implementation with A, B, C, D, E, F, G, H, I, J
// In a full implementation, this would import all 26 letters
const vocabularyDatabase = {
  a: letterA,
  b: letterB,
  c: letterC,
  d: letterD,
  e: letterE,
  f: letterF,
  g: letterG,
  h: letterH,
  i: letterI,
  j: letterJ,
  // k: letterK,
  // ... all the way to z: letterZ
}

// Get all available letters
export const getAvailableLetters = () => {
  return Object.keys(vocabularyDatabase)
}

// Get vocabulary by letter
export const getVocabularyByLetter = (letter) => {
  return vocabularyDatabase[letter.toLowerCase()] || { nouns: [], verbs: [], examples: {} }
}

// Get random letters for variety
export const getRandomLetters = (count = 3) => {
  const availableLetters = getAvailableLetters()
  const shuffled = [...availableLetters].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get all nouns from specified letters
export const getNounsFromLetters = (letters, count = 20, exclude = []) => {
  const allNouns = letters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    return acc.concat(letterData.nouns || [])
  }, [])

  const available = allNouns.filter(noun => 
    !exclude.includes(noun.german)
  )
  
  const shuffled = [...available].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get all verbs from specified letters
export const getVerbsFromLetters = (letters, count = 10, exclude = []) => {
  const allVerbs = letters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    return acc.concat(letterData.verbs || [])
  }, [])

  const available = allVerbs.filter(verb => 
    !exclude.includes(verb.german)
  )
  
  const shuffled = [...available].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get examples by type and letters
export const getExamplesByTypeAndLetters = (type, letters, count = 10) => {
  const allExamples = letters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    return acc.concat(letterData.examples?.[type] || [])
  }, [])

  const shuffled = [...allExamples].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Initialize vocabulary pools with letter-based data
export const initializeVocabularyPools = () => {
  const availableLetters = getAvailableLetters()
  const allWords = availableLetters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    const nouns = (letterData.nouns || []).map(n => n.german)
    const verbs = (letterData.verbs || []).map(v => v.german)
    return acc.concat([...nouns, ...verbs])
  }, [])
  
  return {
    unselected: allWords,
    mastered: [],
    reviewQueue: []
  }
}
