# Chess Application

## Current Progress

- **Game Engine**:
    - Complete board representation and rendering.
    - Move validation for all pieces (Pawn, Rook, Knight, Bishop, Queen, King).
    - Special moves implemented: Castling, Promotion, En Passant.
    - Game state detection: Check, Checkmate, Stalemate, Insufficient Material.
- **Architecture**:
    - Built with Next.js 15, React 19, and Tailwind CSS 4.
    - State management using Zustand.
    - Animations with Motion.

## Future Plan

- **Refinement**:
    - Fix En Passant capture logic (remove captured piece).
    - Implement 50-move rule and Threefold Repetition.
- **Features**:
    - Add game timer and captured pieces display.
    - Implement move history and sound effects.
- **Multiplayer**:
    - Real-time gameplay with Socket.io.
    - Room creation and joining.
- **AI Integration**:
    - Play against computer (Stockfish).
- **User System**:
    - Authentication and user profiles.

## Tasks

### Core Game Logic Refinement

- [x] Fix En Passant Logic (Captured pawn not removed)
- [ ] Verify Castling Logic
- [x] Implement 50-move rule
- [/] Implement Threefold Repetition rule
- [ ] Ensure Game History supports PGN generation

### Game Features (UI/UX)

- [ ] Add Game Timer (Countdown for both players)
- [ ] Add Captured Pieces Display
- [ ] Add Move History List (Side panel)
- [ ] Add Sound Effects (Move, Capture, Check, Game Over)
- [ ] Add "New Game" / "Reset" functionality

### Multiplayer (Socket.io)

- [ ] Set up Custom Server (Express + Socket.io)
- [ ] Implement Room Creation & Joining
- [ ] Sync Game State (Moves, Timer, Resignation)
- [ ] Handle Player Disconnects/Reconnects

### Game Modes & AI

- [ ] Implement Time Controls (Bullet, Blitz, Rapid)
- [ ] Implement "Play vs Computer" (Random Mover first)
- [ ] Integrate Stockfish (WASM) for advanced AI

### User & Social

- [ ] Setup Authentication (NextAuth or Clerk)
- [ ] Create User Profile (Stats, Match History)
- [ ] Implement In-game Chat
