export const LANGUAGE_CONFIG = {
  code: 'de',
  name: 'German',
  articles: ['der', 'die', 'das', 'dem', 'den', 'des', 'ein', 'eine', 'einen', 'einem', 'eines', 'einer'],
  genders: {
    m: 'masculine',
    f: 'feminine',
    n: 'neuter'
  },
  subjects: {
    ich: 'ich',
    du: 'du',
    er: 'er/sie/es',
    wir: 'wir',
    ihr: 'ihr',
    sie: 'sie/Sie'
  },
  ui: {
    welcome: 'Willkommen!',
    todayIsNewDay: 'Today is a new day',
    nextStep: 'Next Step',
    review: 'Review Previous Mistakes',
    vocabulary: 'New Vocabulary',
    genderDrill: 'Gender & Plural Drill',
    articles: 'Articles in Context',
    translations: 'Case Translations',
    verbs: 'Verb Conjugation',
    recap: 'Daily Recap'
  },
  speech: {
    primaryLang: 'de-DE',
    fallbackLangs: ['de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
    voicePreferences: ['Google Deutsch', 'Anna', 'Katja', 'Microsoft Hedda - German (Germany)']
  }
}

// Export German speech configuration for SettingsModal
export const germanSpeechConfig = {
  languages: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
  primaryLang: 'de-DE',
  fallbackLangs: ['de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
  voicePreferences: ['Google Deutsch', 'Anna', 'Katja', 'Microsoft Hedda - German (Germany)']
}