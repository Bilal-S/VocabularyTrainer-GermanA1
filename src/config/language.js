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
  },
  commands: {
    todayIsNewDay: {
      primary: 'Today is a new day',
      aliases: ['New Day', 'tiand'],
      description: 'Start your daily learning routine',
      action: 'startDailyRoutine'
    },
    progressSummary: {
      primary: 'progress summary',
      aliases: ['progress'],
      description: 'Display current learning progress',
      action: 'generateProgressSummary'
    },
    nextStep: {
      primary: 'Next Step',
      aliases: ['Skip', 'Next'],
      description: 'Skip to the next exercise',
      action: 'skipToNextStep'
    },
    redo: {
      primary: 'Redo',
      aliases: [],
      description: 'Display the last set of exercises again',
      action: 'redoLastSet'
    },
    clearAllProgress: {
      primary: 'clear all progress data',
      aliases: [],
      description: 'Reset all your progress',
      action: 'clearAllProgress'
    }
  },
  features: [
    '📚 Structured 7-step daily routine',
    '🎯 Progress tracking and mastery system',
    '💾 Save/load your progress via JSON',
    '📱 Mobile-friendly chat interface',
    '📲 Install as PWA for offline access (Menu ☰ → Install)',
    '🔄 Check for updates manually (Menu ☰ → Check for Updates)'
  ],
  getCommandsList: function() {
    return Object.values(this.commands).map(cmd => {
      const aliases = cmd.aliases.length > 0 
        ? ` (or **"${cmd.aliases.join('"** or **"')}"**)`
        : ''
      return `- **"${cmd.primary}"**${aliases} - ${cmd.description}`
    }).join('\n')
  },
  getFeaturesList: function(isSpeechSupported = false) {
    const baseFeatures = this.features.map(f => `- ${f}`).join('\n')
    const speechFeature = isSpeechSupported 
      ? '- 🔊 German pronunciation with speech synthesis'
      : '- ⚠️ Speech synthesis not supported in this browser'
    return `${baseFeatures}\n${speechFeature}`
  },
  getCommandAliases: function(commandName) {
    const cmd = Object.values(this.commands).find(c => 
      c.primary.toLowerCase() === commandName.toLowerCase() ||
      c.aliases.some(a => a.toLowerCase() === commandName.toLowerCase())
    )
    return cmd ? [cmd.primary, ...cmd.aliases] : []
  },
  getSuggestedCommands: function() {
    return Object.values(this.commands).map(cmd => cmd.primary)
  }
}

// Export German speech configuration for SettingsModal
export const germanSpeechConfig = {
  languages: ['de-DE', 'de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
  primaryLang: 'de-DE',
  fallbackLangs: ['de_DE', 'de-AT', 'de_AT', 'de-CH', 'de_CH', 'de'],
  voicePreferences: ['Google Deutsch', 'Anna', 'Katja', 'Microsoft Hedda - German (Germany)']
}
