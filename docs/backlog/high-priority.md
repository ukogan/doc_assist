# High Priority Backlog

## Emergency Detection System
**Status**: Not started
**Description**: Two-layer detection (keyword + LLM) to identify medical emergencies
**Features**:
- Fast keyword matching for common emergency phrases ("chest pain", "can't breathe", etc.)
- LLM classification using Haiku for edge cases
- Full-screen 911 banner with prominent call button
- Crisis resources (988 Suicide Lifeline, Poison Control)
- Require acknowledgment before continuing with non-emergency question
**Acceptance Criteria**:
- Detects emergencies within 200ms (keyword layer)
- Blocks all interaction until acknowledged
- Provides actionable emergency resources
- Logs emergency events for safety review

---

## Care Timeline View
**Status**: Not started
**Description**: Visual timeline showing case progression, key events, and specialist consultations
**Features**:
- Chronological view of all interactions
- Mark key events (diagnosis discussed, treatment started, etc.)
- Show which specialists were consulted
- Export timeline as PDF or markdown
**Acceptance Criteria**:
- Renders smoothly with 100+ events
- Accessible to screen readers
- Mobile-responsive design

---

## PDF Upload with PII Removal
**Status**: Not started
**Description**: Allow users to upload medical documents with automatic PII removal
**Features**:
- Accept PDF uploads (discharge summaries, lab results, etc.)
- Automatically detect and redact PII (names, DOB, SSN, addresses)
- Extract relevant medical information for context
- Store redacted version only
**Acceptance Criteria**:
- Successfully redacts 99%+ of PII
- Preserves medical terminology and values
- Handles scanned documents (OCR)
- Clear user confirmation of what will be redacted

---

## Multi-language Support
**Status**: Not started
**Description**: Support for Spanish, Chinese, and other common languages
**Languages (priority order)**:
1. Spanish
2. Chinese (Simplified)
3. Vietnamese
4. Korean
5. Tagalog
**Features**:
- UI translation
- Input/output in user's language
- Medical terminology glossary per language
**Acceptance Criteria**:
- Medical terms correctly translated
- Right-to-left support where needed
- Language persists across sessions

---

## Family Sharing
**Status**: Not started
**Description**: Shareable link for family members to view/contribute to the case
**Features**:
- Generate shareable link with expiration
- Read-only vs. contributor access levels
- Activity log of who viewed/contributed
- Revoke access at any time
**Acceptance Criteria**:
- Links expire after configurable time
- Clear privacy warning before sharing
- Cannot access other user's sessions
