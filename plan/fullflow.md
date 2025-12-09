
START
  |
  └── User Command: "Today is a new day"
        |
        ├── Initialize Daily Routine
        │       • Load current state from memory or imported JSON
        │       • Pools:
        │           - Unselected Pool: All remaining A1 words
        │           - Mastered Pool: Words answered correctly 3 times
        │           - Review Queue: Words answered incorrectly last session
        │       • Current Step = 1
        |
        ├── [Step 1: Review Previous Mistakes]
        │       ├── Source: Review Queue
        │       ├── Batch: 10 items
        │       ├── Prompt: English → User answers in German
        │       ├── Feedback:
        │           - Show correct German form
        │           - Explain error in English
        │       ├── State Updates:
        │           - If correct → increment correctCount
        │           - If incorrect → increment incorrectCount
        │           - If correctCount == 3 → move to Mastered Pool
        │       └── Summary → Auto-advance to Step 2
        |
        ├── [Step 2: New Vocabulary]
        │       ├── Source: Unselected Pool
        │       ├── Select 20 random nouns
        │       ├── Prompt: List 20 English nouns
        │       ├── User provides German translations (article + noun)
        │       ├── Handle partial responses until all cleared
        │       ├── State Updates:
        │           - Move answered items from Unselected → progress tracking
        │           - Apply mastery logic (3-correct rule)
        │       └── Summary → Auto-advance to Step 3
        |
        ├── [Step 3: Plural Practice]
        │       ├── Source: Unselected Pool (exclude Step 2 nouns)
        │       ├── Select 20 random nouns
        │       ├── Prompt: German singular → User provides plural
        │       ├── State Updates:
        │           - Track correct/incorrect
        │           - Apply mastery logic
        │       └── Summary → Auto-advance to Step 4
        |
        ├── [Step 4: Articles in Context]
        │       ├── Generate 30 sentences:
        │           - 10 Nominative
        │           - 10 Accusative
        │           - 10 Dative
        │       ├── Batch: 10 at a time
        │       ├── Prompt: Fill-in-the-blank
        │       ├── Feedback: Explain case errors in English
        │       ├── State Updates:
        │           - Track errors for review queue
        │       └── Summary → Auto-advance to Step 5
        |
        ├── [Step 5: Case Translations]
        │       ├── Create 30 English sentences (10 per case)
        │       ├── Batch: 10 at a time
        │       ├── User translates to German
        │       ├── State Updates:
        │           - Track errors for review queue
        │       └── Summary → Auto-advance to Step 6
        |
        ├── [Step 6: Verb Conjugation]
        │       ├── 3 rounds of 10 items
        │       ├── Random verbs + subjects
        │       ├── Prompt: Conjugate verb for subject
        │       ├── State Updates:
        │           - Track errors for review queue
        │       └── Summary → Auto-advance to Step 7
        |
        ├── [Step 7: Daily Recap]
        │       ├── Output Summary in English:
        │           - Nouns introduced today
        │           - Verbs introduced
        │           - Items remaining in Review Queue
        │       └── END OF ROUTINE
        |
COMMANDS (Available Anytime):
  • "Next Step" → Skip current step immediately (no grading, no summary)
  • "progress summary" → Display current learning progress and statistics
  • "clear all progress data" → Reset all pools and progress
  • Import JSON → Load previous state before starting
  • Export JSON → Save current state after session
  |
STATE TRANSITIONS:
  • Correct answer → increment correctCount
  • Incorrect answer → increment incorrectCount + add to Review Queue
  • If correctCount == 3 → move item to Mastered Pool
  • Unselected Pool shrinks as new words are introduced
