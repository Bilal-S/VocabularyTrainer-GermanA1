# Centralize Commands and Features Refactoring Plan

## Overview
This plan outlines refactoring of A1 German Coach codebase to use centralized configuration for available commands and features. Currently, these strings are duplicated across multiple files, making maintenance difficult.

## Current State Analysis

### Commands (Duplicated in 6+ files)
```
- "Today is a new day" (or "New Day" or "tiand") - Start your daily learning routine
- "progress summary" (or progress) - Display current learning progress
- "Next Step" (or "Skip") - Skip to the next exercise
- "Redo" - Display the last set of exercises again
- "clear all progress data" - Reset all your progress
```

**Files containing command strings:**
1. `src/config/language.js` - Partial (todayIsNewDay, nextStep)
2. `src/services/messageService.js` - Full list in welcome/error messages
3. `src/App.jsx` - Full list in welcome message
4. `src/hooks/useDailyRoutine.js` - Full list in welcome/error messages
5. `src/components/HelpModal.jsx` - Command descriptions
6. `src/components/ChatInterface.jsx` - Suggested commands array

### Features (Duplicated in 3+ files)
```
- 📚 Structured 7-step daily routine
- 🎯 Progress tracking and mastery system
- 💾 Save/load your progress via JSON
- 📱 Mobile-friendly chat interface
- 📲 Install as PWA for offline access (Menu ☰ → Install)
- 🔄 Check for updates manually (Menu ☰ → Check for Updates)
```

**Files containing feature strings:**
1. `src/services/messageService.js` - Features list in welcome message
2. `src/App.jsx` - Features list in welcome message
3. `src/hooks/useDailyRoutine.js` - Features list in welcome message

## Proposed Solution

### 1. Create Centralized Configuration in `src/config/language.js`

Extend the existing `LANGUAGE_CONFIG` object with new sections:

```javascript
export const LANGUAGE_CONFIG = {
  // ... existing config ...
  
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
      aliases: ['Skip'],
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
  
  // Helper functions for generating formatted strings
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
```

### 2. File-by-File Refactoring

#### `src/services/messageService.js`
- Replace hardcoded command strings with `LANGUAGE_CONFIG.commands`
- Replace hardcoded feature strings with `LANGUAGE_CONFIG.features`
- Use `LANGUAGE_CONFIG.getCommandsList()` for generating command lists
- Use `LANGUAGE_CONFIG.getFeaturesList(isPWA)` for generating feature lists

#### `src/App.jsx`
- Replace hardcoded command strings with `LANGUAGE_CONFIG.commands`
- Replace hardcoded feature strings with `LANGUAGE_CONFIG.features`
- Use helper functions for generating formatted lists
- Pass `isSpeechSupported` to `getFeaturesList()`

#### `src/hooks/useDailyRoutine.js`
- Replace hardcoded command strings with `LANGUAGE_CONFIG.commands`
- Replace hardcoded feature strings with `LANGUAGE_CONFIG.features`
- Use helper functions for generating formatted lists

#### `src/components/HelpModal.jsx`
- Replace hardcoded command descriptions with `LANGUAGE_CONFIG.commands`
- Use centralized data for command display

#### `src/components/ChatInterface.jsx`
- Replace `suggestedCommands` array with `LANGUAGE_CONFIG.getSuggestedCommands()`

## Benefits

1. **Single Source of Truth**: All command and feature strings defined in one place
2. **Easy Maintenance**: Changes only need to be made once
3. **Consistency**: Ensures all UI displays the same information
4. **Type Safety**: Structured data makes it easier to catch errors
5. **Extensibility**: Easy to add new commands or features

## Implementation Order

1. Update `src/config/language.js` with centralized configuration
2. Update `src/services/messageService.js` (used by multiple components)
3. Update `src/App.jsx` (main component)
4. Update `src/hooks/useDailyRoutine.js` (core logic)
5. Update `src/components/HelpModal.jsx` (help documentation)
6. Update `src/components/ChatInterface.jsx` (suggested commands)
7. Test all changes to ensure no regressions

## Testing Checklist

- [ ] Welcome message displays correctly with all commands
- [ ] Welcome message displays correctly with all features
- [ ] Command aliases work (tiand, New Day, Skip, etc.)
- [ ] Help modal shows correct command descriptions
- [ ] Suggested commands in ChatInterface are correct
- [ ] Error messages show correct command list
- [ ] All existing functionality remains intact
- [ ] Speech synthesis feature displays correctly based on browser support
