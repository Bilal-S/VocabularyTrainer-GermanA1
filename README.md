# A1 German Coach - Vocabulary Training

**Master German A1 vocabulary with structured daily exercises using official Goethe-Institut wordlist**

A progressive web application (PWA) designed to help German language learners master A1 level vocabulary through a structured, chat-based learning experience.

Other languages can be implemented by changing the language files `a.js` to `z.js`; this is the database of all exercises. You will also need to change all references to `German` to your target language.

## ✨ Features

### 🎯 Core Learning System
- **7-Step Daily Routine**: Structured learning path covering all aspects of German vocabulary
- **Official Content**: Based on Goethe-Institut A1 vocabulary curriculum
- **Intelligent Progress Tracking**: Mastery system with spaced repetition
- **Adaptive Learning**: Personalized difficulty based on your performance
- **Review System**: Targeted practice for previously missed words

### 📱 Progressive Web App (PWA)
- **Install as Native App**: Add to home screen on any device
- **Offline Support**: Learn anywhere without internet connection
- **Cross-Platform**: Works on iOS, Android, Windows, macOS
- **Auto-Updates**: Keeps your app current with latest features
- **Manual Update Check**: Check for updates anytime via menu

### 💾 Data Management
- **Progress Export**: Save your learning progress as JSON
- **Progress Import**: Restore progress across devices
- **Persistent Storage**: All data saved locally in your browser
- **Reset Function**: Start fresh anytime

### 🎨 User Experience
- **Mobile-First Design**: Optimized for phones and tablets
- **Chat Interface**: Natural, conversational learning experience
- **Responsive Layout**: Works perfectly on all screen sizes
- **Dark Mode Support**: Easy on the eyes during night study sessions

## 🚀 Quick Start

### Installation

#### Option 1: Install as PWA (Recommended)
1. Open the app in your browser
2. Click the install button (Menu ☰ → Install App)
3. Follow your device's installation prompts
4. Access from your home screen like any native app

#### Option 2: Browser Access
Simply visit the app URL and start learning immediately

#### Option 3: Local Development
```bash
# Clone the repository
git clone https://github.com/Bilal-S/Vocab.git
cd Vocab

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📖 Usage Guide

### Daily Learning Routine

Start your daily practice with the command:
```
"Today is a new day"
```
or the shortcut:
```
"tiand"
```

### Available Commands

| Command | Description |
|---------|-------------|
| `Today is a new day` / `tiand` | Start daily learning routine |
| `Next Step` | Skip to next exercise |
| `clear all progress data` | Reset all progress and start fresh |

### 7-Step Learning Flow

#### **Step 1: 📚 Introduction**
- **Purpose**: Overview of today's learning session and welcome message
- **What Happens**: Displays instructions for the daily routine and available commands
- **Content**: 
  - Welcome message with app overview
  - List of available commands ("Today is a new day", "Next Step", "clear all progress data")
  - Brief explanation of the 7-step learning process
- **Progress**: No exercises, just informational setup for the day

#### **Step 2: 🔄 Review Previous Mistakes**
- **Purpose**: Targeted practice on previously missed vocabulary items
- **What Happens**: Pulls words randomly from `reviewQueue` for reinforcement
- **Process**:
  - Presents up to `maxReviewBatchSize` items (default: 50, configurable 10-99)
  - Shows one item at a time with English→German translation prompts
  - Items must be answered correctly `maxReviewCount` times (default: 3) to be considered mastered
  - Moves mastered items from `reviewQueue` to `mastered` pool
- **Smart Features**:
  - If no items in review queue, automatically advances to Step 3
  - Tracks both singular and plural forms separately for nouns
  - Each correct answer increments the word's `correctCount`
- **Feedback**: Shows correct German answer + English explanation

#### **Step 3: 📖 New Vocabulary (20 Nouns)**
- **Purpose**: Learn 20 new A1 level nouns from official Goethe-Institut vocabulary
- **What Happens**: Introduces fresh vocabulary for daily learning
- **Process**:
  - Randomly selects 20 nouns from `unselected` pool (alphabetical order avoided)
  - Displays all 20 English nouns at once for efficient learning
  - User provides German translations (article + noun) for each
  - Supports partial responses - user can answer some items, resubmit others
  - Moves to next step only when all 20 items are answered
- **Mastery Rules**: Each noun needs `correctCount >= masterCount` (default: 1) to move to mastered pool
- **Error Handling**: Wrong answers are added to `reviewQueue` for future practice

#### **Step 4: 🔢 Plural Practice (20 Nouns)**
- **Purpose**: Master German noun pluralization rules and patterns
- **What Happens**: Reinforces plural forms through focused practice
- **Process**:
  - Randomly selects 20 different nouns from `unselected` pool (different from Step 3)
  - Displays German singular noun, user provides correct plural form
  - Handles irregular plurals and exceptions from A1 vocabulary
  - Supports batch responses with numbered or sequential format
- **Learning Focus**: 
  - Recognizes pluralization patterns (-e, -er, -en endings)
  - Covers irregular plurals (die Mutter → die Mütter)
  - Practices with and without article variations
- **Progress Tracking**: Separate tracking for singular vs plural mastery

#### **Step 5: 📝 Articles in Context (30 Sentences)**
- **Purpose**: Practice correct article usage (der/die/das) in realistic contexts
- **What Happens**: Fill-in-the-blank exercises using authentic German sentences
- **Process**:
  - 30 sentences total: 10 nominative, 10 accusative, 10 dative cases
  - Presented in batches of 10 sentences at a time
  - Each sentence has a blank where user must choose correct article
  - Uses only A1 vocabulary in natural, contextual examples
- **Case Focus**:
  - **Nominative**: Subject of sentences (Der Mann ist groß)
  - **Accusative**: Direct objects (Ich sehe den Mann)
  - **Dative**: Indirect objects (Ich gebe dem Mann das Buch)
- **Smart Feedback**: Explains why specific article is correct in that context

#### **Step 6: 🔄 Case Translations (10 Sentences)**
- **Purpose**: Apply German grammar rules through English→German translation
- **What Happens**: Comprehensive practice of all three main cases
- **Process**:
  - 30 sentences: 10 per case (nominative, accusative, dative)
  - English sentence provided, user translates to German
  - Tests complete sentence construction, not just individual words
  - Available in full batch (30) or partial (10 at a time)
- **Skills Tested**:
  - Word order in German sentences
  - Case system application
  - Preposition usage with correct cases
  - Integration of vocabulary with grammar rules
- **Error Learning**: Mistakes added to `reviewQueue` for targeted review

#### **Step 7: 📋 Daily Recap**
- **Purpose**: Consolidate learning and track daily progress
- **What Happens**: Comprehensive summary of today's achievements
- **Content Displayed**:
  - **Nouns Learned**: Count and specific words introduced in Steps 3-4
  - **Verbs Introduced**: New verbs practiced during the session
  - **Review Progress**: Items moved from `reviewQueue` to `mastered`
  - **Remaining Work**: Items still in review queue for future sessions
  - **Session Statistics**: Total questions answered, accuracy rates, time spent
- **Progress Visualization**: Clear display of learning milestones achieved
- **Forward Planning**: Preview of what next session will focus on

### **Learning Algorithm Details**

#### **Mastery System**
- **Mastering Count**: Configurable (1-9), default = 1
- **Tracking**: Each vocabulary item tracks `correctCount` and `incorrectCount`
- **Pool Management**:
  - `unselected`: Never-seen vocabulary
  - `reviewQueue`: Incorrectly answered items needing practice
  - `mastered`: Correctly answered `masteringCount` times
- **Smart Exclusion**: Mastered items never appear in new exercises

#### **Batch Response Handling**
- **Flexible Submission**: Accepts numbered or sequential answer formats
- **Partial Progress**: Can answer some items, continue later with remaining
- **Running Summary**: Shows cumulative progress through current batch
- **Auto-advancement**: Moves to next step when batch is complete

#### **Error Recovery**
- **Immediate Feedback**: Correct answers shown with explanations
- **Review Queue**: Wrong answers automatically added for tomorrow
- **External Help**: Links to ChatGPT for detailed grammar explanations
- **Progress Preservation**: All learning progress saved to localStorage

### PWA Features

#### Installing the App
1. **Desktop**: Click install button in address bar or use Menu ☰ → Install App
2. **Mobile**: Use browser's "Add to Home Screen" feature
3. **Any Device**: Menu ☰ → Install Help for device-specific instructions

#### Updating the App
- **Automatic**: App checks for updates every 24 hours (PWA only)
- **Manual**: Menu ☰ → Check for Updates (PWA only)
- Updates include new vocabulary, bug fixes, and feature improvements

#### Offline Usage
Once installed, the app works completely offline:
- All vocabulary data cached locally
- Progress tracking works offline
- Sync when connection restored (future feature)

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** - Modern, component-based UI
- **Vite** - Fast development and optimized builds
- **Tailwind CSS** - Utility-first styling system
- **PWA** - Service Worker + Manifest for native app experience

### Data Structure
- **Alphabet-Based Organization**: Vocabulary divided by letter (A-Z)
- **Semantic Format**: Structured nouns, verbs, and examples
- **Progress Tracking**: Individual word mastery states
- **Session Analytics**: Learning statistics and performance metrics

### Key Components
- `UpdateChecker` - Automatic and manual update system
- `VocabularyManager` - Word selection and progress tracking
- `useDailyRoutine` - Session flow management
- `useInstallInstructions` - Device-specific PWA installation guidance

## 📊 Data Sources

### Goethe-Institut A1 Vocabulary
- **Official Curriculum**: Based on certified German language materials
- **Comprehensive Coverage**: 1000+ essential A1 words
- **Structured Learning**: Nouns, verbs, articles, and examples
- **Progressive Difficulty**: Organized by learning complexity

### Vocabulary Categories
- **Nouns**: Gendered articles and plural forms
- **Verbs**: Complete conjugation tables
- **Examples**: Contextual usage patterns
- **Grammar**: Articles, cases, and sentence structure

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── data/vocabulary/    # A1 vocabulary by letter
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── styles/            # CSS and styling

public/
├── icons/             # PWA app icons
├── version.json        # App version info
└── german-coach-icon.svg  # App logo
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Browser Support
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 📱 Device Compatibility

### Installation Methods
| Device | Method | Instructions |
|---------|---------|-------------|
| **Desktop** | Browser Install | Menu ☰ → Install App |
| **iPhone/iPad** | Add to Home Screen | Share → Add to Home Screen |
| **Android** | Add to Home Screen | Menu → Add to Home Screen |
| **Windows** | Install as App | Click install icon in address bar |

### Update System
- **PWA Users**: Automatic + manual updates
- **Browser Users**: Refresh page for latest version
- **Version Info**: Settings → About or check console

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style and patterns
- Test on multiple devices/browsers
- Update documentation for new features
- Ensure PWA functionality works

### Adding Vocabulary
- Use official Goethe-Institut materials
- Follow existing data structure
- Include proper articles and conjugations
- Add contextual examples

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- **Live Demo**: https://germanA1.boncode.net
- **Repository**: https://github.com/Bilal-S/Vocab
- **Issues**: https://github.com/Bilal-S/Vocab/issues

## 📞 Support

### Getting Help
- **In-App Help**: Menu ☰ → Help
- **Device Instructions**: Menu ☰ → Install Help
- **Report Issues**: Use GitHub Issues

### Troubleshooting

**App Not Installing?**
- Check browser compatibility
- Clear browser cache
- Ensure HTTPS connection
- Try different browser

**Progress Not Saving?**
- Check browser localStorage permissions
- Ensure enough storage space
- Try refreshing the page

**Updates Not Working?**
- Check internet connection
- Manually check for updates
- Clear browser cache and reload

---

**Happy Learning! 🇩🇪**

Master German A1 vocabulary with structured, daily practice. Install as a PWA for the best experience!
