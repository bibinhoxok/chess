# Chess Project Tasks

- [ ] **Single Player & AI**
    - [ ] **Foundational Logic**
        - [ ] Add `gameMode` ('pvc', 'analysis') to Game Store
        - [ ] Add `aiColor` ('white' | 'black') state
        - [ ] Update Game Status handling for Single Player
    - [ ] **DIY AI Engine (Minimax)**
        - [ ] Implement `evaluateBoard` (Material + Position)
        - [ ] Implement `getBestMove` (Minimax + Alpha-Beta)
        - [ ] Add Basic Positional Heuristics
    - [ ] **Game Loop Integration**
        - [ ] Trigger AI Move after Player Move
        - [ ] Handle AI Promotion
        - [ ] Add Thinking Delay

- [ ] **Visual & Feedback**
    - [ ] **Game State Feedback**
        - [ ] Show **Check Alert** (Visual indicator on King or Toast)
        - [ ] Show **Game Over Modal/Alert** (Checkmate, Stalemate, etc.)
        - [ ] Prevent moves after Game Over

- [ ] **Advanced Controls**
    - [ ] **Planning Arrows**
        - [ ] Detect Right-Click/Drag on board
        - [ ] Store internal arrow state (fromSquare -> toSquare)
        - [ ] Render arrows on SVG layer above board
        - [ ] Clear arrows on Left-Click or Move
    - [ ] **Premove System**
        - [ ] Allow move input during opponent's turn
        - [ ] Store `queuedMove` in state
        - [ ] Execute `queuedMove` immediately when turn starts
        - [ ] Cancel premove if move becomes illegal

- [ ] **Analysis & UI**
    - [ ] **Analysis System**
        - [ ] Analysis Panel Logic (Score, Best Move)
        - [ ] Visual Suggestion Arrows
    - [ ] **Evaluation Bar**
        - [ ] Create Component
        - [ ] Animate based on Score

- [ ] **Commentary**
    - [ ] **Commentary Logic**
        - [ ] Opening Identification
        - [ ] Move Description Generator
        - [ ] Strategy/Tips Generator
    - [ ] **Commentary UI**
        - [ ] Create Scrollable Commentary Box
        - [ ] Style with "Guide" Persona <!-- id: 9b -->
