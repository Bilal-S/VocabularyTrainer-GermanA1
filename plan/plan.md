# German A1 Coach Plan



## Project Overview
This is a chat-based German A1 vocabulary learning application that provides a structured 7-step daily routine. It's a client-side SPA that uses only official Goethe-Institut A1 vocabulary, with state management via localStorage and JSON import/export capabilities.

## Technical Architecture Plan

### **1. Technology Stack**
- **Frontend Framework**: React (recommended for component-based architecture)
- **Build Tool**: Vite (for fast development and modern bundling)
- **Styling**: Tailwind CSS (for responsive, mobile-friendly design)
- **State Management**: React Context + localStorage
- **UI Components**: Custom chat interface with markdown support
- **Development Server**: Node.js HTTP server for local testing

### **2. Project Structure**
```
vocab/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx
│   │   ├── Message.jsx
│   │   ├── SectionBanner.jsx
│   │   └── ImportExportModal.jsx
│   ├── data/
│   │   ├── vocabulary.json (parsed from A1_SD1_Wortliste_02.pdf)
│   │   ├── sentences.json (pre-generated exercises)
│   │   └── masteredWords.json (from GPT mastered list.docx)
│   ├── hooks/
│   │   ├── useVocabularyState.js
│   │   └── useDailyRoutine.js
│   ├── utils/
│   │   ├── vocabularyManager.js
│   │   ├── exerciseGenerator.js
│   │   └── stateManager.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

### **3. Core Implementation Plan**

#### **Phase 1: Foundation Setup**
- Initialize React + Vite project with Tailwind CSS
- Set up basic project structure and routing
- Create localStorage state management system
- Implement JSON import/export functionality

#### **Phase 2: Data Preparation**
- Parse A1_SD1_Wortliste_02.pdf into structured JSON
- Parse mastered words list from GPT mastered list.docx
- Pre-generate extensive exercise database:
  - Noun vocabulary sets
  - Plural forms
  - Fill-in-the-blank sentences (nominative, accusative, dative)
  - Translation sentences
  - Verb conjugation sets

#### **Phase 3: Core Components**
- ChatInterface component with message display
- Command processing system ("Today is a new day", "Next Step", etc.)
- SectionBanner with dynamic colors and progress indicators
- Message component with markdown support

#### **Phase 4: Exercise Engine**
- Implement 7-step daily routine logic
- Exercise generators for each step
- Answer validation and feedback system
- Progress tracking and mastery logic (3-correct rule)
- Randomization algorithms

#### **Phase 5: State Management**
- Pool management (unselected, mastered, reviewQueue)
- Progress tracking per vocabulary item
- Session state persistence
- JSON import/export with validation

#### **Phase 6: UI/UX Polish**
- Mobile-responsive design
- Smooth transitions between sections
- Loading states and error handling
- Accessibility improvements
- Performance optimization

### **4. Key Features Implementation Details**

#### **Chat Interface**
- Real-time message display with typing indicators
- Command recognition and execution
- Markdown support for formatted responses
- Scroll to latest messages

#### **Exercise Logic**
- **Step 1**: Review queue processing with batch handling
- **Step 2**: New vocabulary introduction with partial response handling
- **Step 3**: Plural practice with German→German prompts
- **Step 4**: Context-based article exercises (10 per case)
- **Step 5**: English→German translations by case
- **Step 6**: Verb conjugation with random subjects
- **Step 7**: Daily recap generation

#### **State Management**
- localStorage for persistence
- JSON import/export via file upload/download
- Pool transitions and mastery tracking
- Session recovery capabilities

### **5. Technical Considerations**

#### **Performance**
- Load entire vocabulary dataset in memory
- Efficient randomization algorithms
- Optimized rendering for chat messages
- Lazy loading for exercise generation

#### **Data Validation**
- Strict vocabulary boundary enforcement
- Answer validation with multiple correct forms
- JSON schema validation for import/export

#### **Error Handling**
- Graceful handling of incomplete responses
- Network error recovery for state operations
- User-friendly error messages

### **6. Development Workflow**
1. Set up development environment
2. Create data parsing scripts for PDF/DOCX
3. Build core components incrementally
4. Implement exercise engines step-by-step
5. Add state management and persistence
6. Polish UI/UX and optimize performance
7. Test all flows and edge cases

### **7. Questions for Clarification**
1. Do you have the actual `A1_SD1_Wortliste_02.pdf` and `GPT mastered list.docx` files available?
2. What's your preference between React vs Vue for the frontend framework?
3. Should the exercise database be generated once during build or dynamically during runtime?
4. Do you have any specific design preferences or should I create a modern, clean interface?



