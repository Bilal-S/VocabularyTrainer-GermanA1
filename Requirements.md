Here’s a **Product Requirement Document (PRD)** for your single-page web application based on the detailed behavior you provided:

***

# **Product Requirement Document (PRD)**

**Project Name:** A1 German Coach (Goethe-only)  
**Type:** Single Page Web Application (SPA)  
**Primary Goal:** Help learners practice German at A1 level using a structured daily routine without AI-generated content.

***

## **1. Overview**

The application provides a **chat-based interface** for learners to follow a structured daily routine for German learning at A1 level. It uses only vocabulary from the official Goethe-Institut A1 Wortliste (`A1_SD1_Wortliste_02.pdf`) and excludes mastered words from a user-provided list. The system tracks progress, supports JSON-based state import/export, and ensures strict adherence to A1 vocabulary.
It should use modern web standards with response behavior and attractive designs with easy to read prompts and visuals.

***

## **2. Key Features**

### **2.1 Chat Interface**

*   Conversational UI for interaction.
*   Commands:
    *   **“Today is a new day”** → triggers full daily routine.
    *   **“Next Step”** → skips current step and moves to next.
    *   **“clear all progress data”** → resets user progress.
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

### **2.3 Vocabulary Boundary**

*   Use only words from `A1_SD1_Wortliste_02.pdf`.
*   Exclude mastered words from `GPT mastered list.docx`.
*   Random selection from unselected pool (never alphabetical).

### **2.4 Daily Routine Steps**

#### **Step 1: Review Previous Mistakes**

*   Pull items from `reviewQueue`.
*   Batch of 10 items.
*   Prompt: English → user responds in German.
*   Feedback: Correct German + English explanation.

#### **Step 2: New Vocabulary (20 Nouns)**

*   Randomly select 20 nouns from unselected pool.
*   Display all English nouns at once.
*   User provides German translations (article + noun).
*   Handle partial responses until all 20 cleared.

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
*   Batch of 10 at a time.

#### **Step 6: Verb Conjugation (3 Rounds)**

*   Each round: 10 items.
*   Random verbs + subjects.
*   User provides correct conjugation.

#### **Step 7: Daily Recap**

*   Summary in English:
    *   Nouns learned.
    *   Verbs introduced.
    *   Items remaining in review queue.

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
    *   From `A1_SD1_Wortliste_02.pdf` instructions parse and pregenerate a large number of questions and examples, each section should use its own JSON files that can be expanded.
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
*   Use node http for local development and testing with assumption that a this will be hosted on web server.


***

## **56. Non-Functional Requirements**

*   **Performance:**
    *   Load entire vocabulary in memory for fast access.
*   **Usability:**
    *   Simple, mobile-friendly chat interface.
*   **Compliance:**
    *   Strict adherence to A1 vocabulary list.

***

## **6. JSON State Structure**

```json
{
  "userId": "string",
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
    "mastered": ["word3"],
    "reviewQueue": ["word4"]
  },
  "currentStep": 1,
  "batchProgress": {
    "answered": [],
    "remaining": []
  }
}
```

***

## **7. Constraints**

*   No AI-generated during processing. Pregenerate from the wordlist a database of questions and sentences to be used that is extensive enough to have 
*   No alphabetical order in exercises.
*   Must handle partial responses gracefully by re-prompting for remaining answers for the section.


