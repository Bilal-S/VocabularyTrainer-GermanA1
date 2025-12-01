# **Product Requirement Document (PRD)**

* **Project Name:** A1 German Coach 
* **Type:** Progressive Web Application (PWA)  
* **Primary Goal:** Help learners practice German at A1 level using a structured daily routine without AI-generated content.
* **Author:** Boncode

***

## **1. Overview**

The application provides a **chat-based interface** for learners to follow a structured daily routine for German learning at A1 level. It uses only vocabulary from the official Goethe-Institut A1 Wortliste (`a1_word-list.md`) and excludes mastered words that can be imported. The system tracks progress, supports JSON-based state import/export, and ensures strict adherence to A1 vocabulary.
It should use modern web standards with response behavior and attractive designs with easy to read prompts and visuals.

* In the hamburger menu there should be a mastering frequency option.
    * An input box will be presented to enter an integer value between 1 and 9
    * The Mastering Count determines how many times the user has to answer a question for it to be considered mastered and moved to the `mastered` pool. 
    By default the `masteringCount` is set to one and an item is considered as `mastered` and should be moved to the mastered pool if it has been answered correctly one time, i.e. `correctCount = 1`.
    * important: track answers to both singular and plural form of a noun separately; both forms need to be answered correctly in order for the noun to be considered mastered. Both need to be answered >=`masteringCount` consider the noun mastered.


* In the hamburger menu there should be a review count and review batch option.
    * An input box will be presented to enter an integer value between 1 and 9.
    * An input box will be presented to enter integer for `maxReviewBatchSize` size with value from 10 to 99. Default value is 50.
    * The Review Count will determine how many times an item has be answered correctly before it can be moved from `reviewQueue` to `mastered` pool.
    * All items to be reviewed will be presented once a day and need to be completed before moving on to step 2. If we have 17 items in the queue we will present 17 items one at time for user to answer.
    * By default the `maxReviewCount` is set to `3`

All entered values should be exported in Export and Imported in JSON format in the `settings` key.
Once an item is in the mastered pool it should not be used in any of the questions.

***

## **2. Key Features**

### **2.1 Chat Interface**

*   Conversational UI for interaction.
*   Commands:
    *   **"Today is a new day"** → triggers full daily routine.
    *   **"Next Step"** → skips current step and moves to next.
    *   **"clear all progress data"** → resets user progress.
*   Static Section Headers banners. As you move to next section the section header description, colors should update to reflect the new section. The banner should display progress inside the current section.
*   Start with `Introduction` section that describes this application and basic commands.

### **2.2 State Management**

*   **Import/Export JSON**:
    *   `state` includes:
        *   User progress (correct/incorrect counts per item).
        *   Pools: `unselected`, `mastered`, `reviewQueue`.
        *   Current step and batch progress.
*   Allow user to upload/download JSON before/after sessions.
*   There should be buttons on the UI that allow import (upload) and export(download) of the current relevant browser local storage in JSON format with the state of the user.
*   The import export should be available via Hamburger Menu or via typed command in chat and go to separate Import/Export screen.
*   The Mastering Count should be available in Hamburger Menu and provide a popup to change the count which defaults to one.

### **2.3 Vocabulary Boundary**

*   Use only words from `a1_word-list.md` or German A1 levels.
*   Exclude mastered words from your memory `progress.mastered.nouns` and `progress.mastered.verbs`
*   Random selection from unselected pool (never alphabetical).

### **2.4 Daily Routine Steps**

#### **Step 1: Review Previous Mistakes**

*   Pull review items RANDOMLY from `reviewQueue`.
*   Present up to `maxReviewBatchSize` from available review items to user. Presented one item at a time. 
*   If no items to review queue move to next step automatically.
*   Prompt variable based on section the item originates and correct inputs: 
    *   Sections 2 and 5: English → user responds in German.
    *   Sections 3: German singular → user provides plural
    *   Section 4: Fill in the blank sentence
    *   Section 6: German subject verb conjugated
*   Ensure you are using the correct pattern to evaluate the answer based on the section it originates from.
*   Feedback: Correct German + English explanation.

#### **Step 2: New Vocabulary (20 Nouns)**

*   Randomly select 20 nouns from the unselected pool.
*   Display all English nouns at once.
*   User provides German translations (article + noun).
*   Handle partial responses until all 20 are cleared.

#### **Step 3: Plural Practice (20 Nouns)**

*   Randomly select 20 nouns (different from Step 2).
*   Prompt: German singular → user provides plural.
*   Handle partial responses.

#### **Step 4: Articles in Context (30 Sentences)**

*   10 nominative, 10 accusative, 10 dative.
*   Fill-in-the-blank sentences using A1 vocabulary.
*   Batch of 10 at a time.

#### **Step 5: Case Translations (30 Sentences)**

*   English → German translations.
*   10 per case (Nom, Acc, Dat).
*   Batch of 10 or 30 at a time.

#### **Step 6: Verb Conjugation (3 Rounds)**

*   Each round: 10 items.
*   Random verbs + subjects.
*   User provides correct conjugation.

#### **Step 7: Daily Recap**

*   Summary in English:
    *   Nouns learned.
    *   Verbs introduced.
    *   Items added to review queue.
    *   Items remaining in review queue.

### **2.5 Adding Mistakes to Review Pool** 

* any question that has been wrongly answered in Step 2 through 6 should be added to the review queue 

### **2.6 Adding to Mastered Pool** 
* any question that has been correctly answered in Step 2 through 6 based on `correctCount` >= `masteringCount` should be added to the mastered pool in the right section `nouns`, `verbs`, or `words`
  
### **2.7 Startup Display** 

* When user enters `Today is a new day` the screen should be cleared before drawing the instructions text box and and a new text box starting the exercises either step 1 or step 2
* If the user enters the app again and we have old data, we should display previous day's summary in text box followed by text box with the initial instructions
* If we do not have old data, display instructions text box
  

***

## **3. Feedback Rules**

*   **Mistakes:** Show correct German + English explanation if possible. For each mistake link to ChatGPT with `https://chatgpt.com/?q=` pattern that opens in new window so user can get feedback why something is wrong. Escape URL parameters properly.
*   **Summaries:** Always in English.
*   Accept any correct article (definite or indefinite).
*   ** 

***

## **4. Technical Requirements**

*   **Frontend:**
    *   Framework: React or Vue (SPA).
    *   Chat UI with markdown support.
    *   State persistence in local storage + JSON import/export.
*   **Backend:**
    *   None required (logic runs client-side).
    *   Vocabulary loaded from static JSON (parsed from PDF).
*   **Data:**
    *   From `a1_word-list.md` parse and pregenerate a large number of questions and examples as shown in a.js, each letter of the alphabet should use its own JSON files that can be expanded.
        *   Fields: `word`, `type` (noun/verb/etc.), `plural`, `examples`.
    *   Keep state memory in local browser storage about progress, mistakes, selected pool

*   **Randomization:**
    *   Use secure random selection for exercises.

***

## **5. Local Testing**

*   **Performance:**
    *   Load entire vocabulary in memory for fast access.
*   **Usability:**
    *   Simple, mobile-friendly chat interface.
*   **Compliance:**
    *   Strict adherence to A1 vocabulary list.
*   Use node http for local development and testing with the assumption that this will be hosted on a web server.

***

## **6. Non-Functional Requirements**

*   **Performance:**
    *   Load entire vocabulary in memory for fast access.
*   **Usability:**
    *   Simple, mobile-friendly chat interface.
*   **Compliance:**
    *   Strict adherence to A1 vocabulary list.

***

## **7. JSON State Structure**

This is the export/import JSON structure that needs to be exported from local storage and merged into local storage.

```json
{
  "userId": "string",
  "settings": {"masteringCount":1,"maxReviewBatchSize":50, "maxReviewCount":3},
  "progress": {
    "items": {
      "word": {
        "correctCount": 0,
        "incorrectCount": 0
      }
    }
  },
  "pools": {
    "unselected": ["word1", "word2"],
    "mastered": {"nouns":["word3"],"verbs":["word5"]},
    "reviewQueue": ["word5"]
  },
  "currentStep": 1,
  "batchProgress": {
    "answered": [],
    "remaining": []
  },
  "availableExtra": {
    "nouns": [],
    "verbs": [],
    "examples" :[]
  }  
}
```

* availableExtra: this key contains any extra nouns, verbs and examples that can be added to the database for questions. Input should be validated and match the pattern in `a.js` through `z.js` files.

***

## **8. Constraints**

*   No AI-generated during processing. Pregenerate from the wordlist a database of questions and sentences to be used that is extensive enough to have 
*   No alphabetical order in exercises.
*   Must handle partial responses gracefully by re-prompting for remaining answers for the section.

***

## **9. Batch Grading Patterns**

### **9.1 Multiple Submissions Handling**

The application supports cumulative partial responses for batch exercises. When users submit partial answers:

*   **State Preservation**: All previously submitted and graded answers are preserved in system state.
*   **Progressive Feedback**: Only feedback for newly submitted items is shown in each response.
*   **Running Summary**: The section header maintains and displays a cumulative progress bar of the number of answers submitted and questions vs total questions.
*   **Remaining Items**: The system re-prompts with only the remaining unanswered items, maintaining original numbering.

### **9.2 Numbered vs Sequential Answer Formats**

#### **Numbered Format (Preferred)**
Users can submit answers with original question numbers:
```
1. der Abflug
3. das Angebot
5. die Antwort
```

*   Answers are mapped to their exact question positions
*   System validates that numbers correspond to unanswered items
*   Provides targeted feedback for specified items

#### **Sequential Format**
Users can submit answers without numbers:
```
der Abflug
das Angebot
die Antwort
```

*   Answers are mapped sequentially to remaining unanswered items
*   System maintains internal tracking of which items remain
*   Provides feedback in order of submission

### **9.3 Error Handling**

*   **Mixed Format Detection**: System rejects responses that mix numbered and sequential formats
*   **Duplicate Prevention**: Previously answered items cannot be re-submitted
*   **Validation Feedback**: Clear error messages for malformed responses
*   **Retry Guidance**: Specific instructions on correct response format

### **9.4 Feedback Structure**

Each partial response follows this pattern:

1. **Header**: `[Step X | Batch Y | Grading Partial Response]`
2. **New Feedback**: Feedback only for items in current submission
3. **Running Summary**: All answers submitted so far with original numbering
4. **Remaining Prompt**: Updated list of remaining items with original numbers
5. **Progress Indicators**: Clear count of completed vs remaining items

### **9.5 Completion Handling**

*   **Auto-advancement**: When all items in a batch are answered, the system automatically moves to the next step
*   **Final Summary**: Completion message shows progress statistics
*   **Transition Message**: Clear indication of the next step with instructions

***

## **10. Vocabulary Data Structure**

To optimize file size and maintenance, vocabulary files (`src/data/vocabulary/[letter].js`) use a compact, position-based array format. The application hydrates this data into standard objects at runtime.

### **10.1 Compact Storage Format**

#### **Nouns**
Stored as an object where the key is the English meaning and value is an array:
```json
{
  "English Word": ["German Singular", "German Plural", "Singular Article", "Plural Article", "Gender Code"]
}
```
*   **Gender Codes**: `m` (masculine), `f` (feminine), `n` (neuter)

#### **Verbs**
Stored as an object where the key is the English meaning and value is an array of 10 items:
```json
{
  "English Meaning": [
    "Infinitive",
    "ich form",
    "du form",
    "er form",
    "sie (she) form",
    "es form",
    "wir form",
    "ihr form",
    "sie (they) form",
    "Sie (formal) form"
  ]
}
```

### **10.2 Runtime Hydration**

The `src/data/vocabulary/index.js` loader transforms this compact data into usable objects:

*   **Noun Object**:
    *   `german`: Reconstructed as "Article + Word" (e.g., "der Abend")
    *   `plural`: Reconstructed as "Plural Article + Plural Word" (e.g., "die Abende")
    *   `gender`: Mapped from code to full string (e.g., 'm' -> 'masculine')

*   **Verb Object**:
    *   `german`: Infinitive form.
    *   `conjugations`: An object with explicit keys to avoid ambiguity:
        *   `ich`, `du`, `er`, `es`, `wir`, `ihr`, `Sie` (standard)
        *   `sie (she)`: Mapped from index 4
        *   `sie (they)`: Mapped from index 8

***

## **11. Technology Stack**


### **11.2 Target Technology Stack**

* **Build Tool**: Vite 7.0.0
* **Frontend Framework**: React 19.0.0
* **Styling**: Tailwind CSS 3.3.6 (unchanged - see upgrade note)
* **TypeScript Types**: @types/react 19.0.0, @types/react-dom 19.0.0
* **Development**: PostCSS 8.5.1, Autoprefixer 10.4.20




