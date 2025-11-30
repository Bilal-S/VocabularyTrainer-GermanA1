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
import { letterK } from './k.js'
import { letterL } from './l.js'
import { letterM } from './m.js'
import { letterN } from './n.js'
import { letterO } from './o.js'
import { letterP } from './p.js'
import { letterQ } from './q.js'
import { letterR } from './r.js'
import { letterS } from './s.js'
import { letterT } from './t.js'
import { letterU } from './u.js'
import { letterV } from './v.js'
import { letterW } from './w.js'
import { letterX } from './x.js'
import { letterY } from './y.js'
import { letterZ } from './z.js'

// Full alphabet implementation
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
  k: letterK,
  l: letterL,
  m: letterM,
  n: letterN,
  o: letterO,
  p: letterP,
  q: letterQ,
  r: letterR,
  s: letterS,
  t: letterT,
  u: letterU,
  v: letterV,
  w: letterW,
  x: letterX,
  y: letterY,
  z: letterZ
}

const genderMap = {
  m: 'masculine',
  f: 'feminine',
  n: 'neuter',
  p: 'plural'
}

// Hydrate compact format into full object structure
const transformData = (letterData) => {
  if (!letterData) return { nouns: [], verbs: [], examples: {} }

  const nouns = (letterData.nouns || []).map(item => {
    const english = Object.keys(item)[0]
    const values = item[english]
    return {
      german: `${values[2]} ${values[0]}`, // Reconstruct full string like "der Abend"
      word: values[0], // Store raw word if needed
      english: english,
      type: 'noun',
      plural: `${values[3]} ${values[1]}`, // Reconstruct full plural string like "die Abende"
      article: values[2],
      pluralArticle: values[3],
      gender: genderMap[values[4]] || values[4]
    }
  })

  const verbs = (letterData.verbs || []).map(item => {
    const english = Object.keys(item)[0]
    const values = item[english]
    return {
      german: values[0], // Infinitive
      english: english,
      type: 'verb',
      conjugations: {
        ich: values[1],
        du: values[2],
        er: values[3],
        'sie (she)': values[4], 
        es: values[5],
        wir: values[6],
        ihr: values[7],
        'sie (they)': values[8],
        Sie: values[9]
      }
    }
  })

  return {
    nouns,
    verbs,
    examples: letterData.examples || {}
  }
}

// Get all available letters
export const getAvailableLetters = () => {
  return Object.keys(vocabularyDatabase)
}

// Get vocabulary by letter
export const getVocabularyByLetter = (letter) => {
  const rawData = vocabularyDatabase[letter.toLowerCase()]
  return transformData(rawData)
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

// Get all nouns from ALL letters (for true randomization)
export const getAllNounsFromAllLetters = (exclude = []) => {
  const availableLetters = getAvailableLetters()
  const allNouns = availableLetters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    return acc.concat(letterData.nouns || [])
  }, [])

  const available = allNouns.filter(noun => 
    !exclude.includes(noun.german)
  )
  
  // CRITICAL FIX: Use Fisher-Yates shuffle for better randomization
  const shuffled = fisherYatesShuffle([...available])
  return shuffled
}

// CRITICAL FIX: Implement Fisher-Yates shuffle algorithm for true randomization
const fisherYatesShuffle = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get all verbs from ALL letters (for true randomization)
export const getAllVerbsFromAllLetters = (exclude = []) => {
  const availableLetters = getAvailableLetters()
  const allVerbs = availableLetters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    return acc.concat(letterData.verbs || [])
  }, [])

  const available = allVerbs.filter(verb => 
    !exclude.includes(verb.german)
  )
  
  // CRITICAL FIX: Use Fisher-Yates shuffle for better randomization
  const shuffled = fisherYatesShuffle([...available])
  return shuffled
}

// Get all examples by type from ALL letters (for true randomization)
export const getAllExamplesFromAllLetters = (type) => {
  const availableLetters = getAvailableLetters()
  const allExamples = availableLetters.reduce((acc, letter) => {
    const letterData = getVocabularyByLetter(letter)
    return acc.concat(letterData.examples?.[type] || [])
  }, [])

  // CRITICAL FIX: Use Fisher-Yates shuffle for better randomization
  const shuffled = fisherYatesShuffle([...allExamples])
  return shuffled
}

// Get total count of all vocabulary words in the database
export const getTotalVocabularyCount = () => {
  const availableLetters = getAvailableLetters()
  let totalCount = 0
  
  availableLetters.forEach(letter => {
    const letterData = vocabularyDatabase[letter.toLowerCase()]
    if (letterData) {
      totalCount += (letterData.nouns || []).length
      totalCount += (letterData.verbs || []).length
    }
  })
  
  return totalCount
}
