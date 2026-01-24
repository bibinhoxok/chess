# Prioritized Chess Project Tasks

This list organizes the project tasks by priority, determining the implementation order.

## 1. Visual & Feedback (UX Critical)

> **Rationale**: Since "Hot Seat" PvP is already working, adding feedback (Check alerts, Game Over modals) will immediately polish the existing experience and make debugging the upcoming AI much easier.

- [ ] **Check Alert**: Visual indicator when King is in check.
- [ ] **Game Over UI**: Modals for Checkmate, Stalemate, etc.
- [ ] **Move Prevention**: Stop interaction when game is over.

## 2. Core Gameplay & AI Foundation (Essential)

> These tasks enable the basic "Player vs Computer" experience.

- [ ] **Foundational Logic**: Add `gameMode` and `aiColor` to store.
- [ ] **DIY AI Engine**: Implement basic Minimax engine with Alpha-Beta pruning.
- [ ] **Game Loop Integration**: Connect AI move generation to the game cycle.

## 3. Analysis & Advanced Controls (Enhancement)

> These features improve the depth of the game.

- [ ] **Analysis System**: Score calculation and best move suggestions.
- [ ] **Evaluation Bar**: Visual representation of the game state.
- [ ] **Planning Arrows**: Visual planning tool for users.
- [ ] **Premove System**: Allow queuing moves.

## 4. Commentary & Content (Polish)

> Additional layer of engagement and educational content.

- [ ] **Commentary Logic**: Move descriptions, opening names, strategy tips.
- [ ] **Commentary UI**: Stylized display for the commentary feed.
