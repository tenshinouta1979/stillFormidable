# Still Formidable

Still Formidable - A lifetime of mastery doesn't fade. These retired professionals carry deep experience, sharp insight, and enduring skill, ready to lend their strength where it matters most.

## Overview

A quest board platform where retired professionals (members) can post and accept quests based on their rank (F → SSS). The platform includes a referral system where members can refer other members.

## Features

### Part 1 — Quest Bulletin Board
- Create quests with title, description, and rank requirements
- List all quests sorted by newest
- View individual quest details

### Part 2 — Reference-Based Member System
- Create members with optional referrer
- View member profiles
- View referral chains (list members referred by a specific person)

### Part 3 — Rank System (F → SSS)
- Rank hierarchy: F, E, D, C, B, A, S, SS, SSS
- Members can only accept quests at or below their rank
- Quest acceptance validation

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Testing**: Jest + Supertest

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tenshinouta1979/stillFormidable.git
   cd stillFormidable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb stillformidable
   ```
   
   Copy the example environment file and configure your database:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/stillformidable
   PORT=3000
   NODE_ENV=development
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Members

- **POST /members** - Create a new member
  ```json
  {
    "name": "John Doe",
    "rank": "B",
    "referrer_id": 1  // optional
  }
  ```

- **GET /members/:id** - Get member profile

- **GET /members/:id/referrals** - List members referred by this member

### Quests

- **POST /quests** - Create a new quest
  ```json
  {
    "title": "Defeat the Dragon",
    "description": "A dangerous dragon has appeared",
    "rank_required": "S",
    "posted_by_member_id": 1
  }
  ```

- **GET /quests** - List all quests (sorted by newest)

- **GET /quests/:id** - View a single quest

- **POST /quests/:id/accept** - Accept a quest
  ```json
  {
    "member_id": 1
  }
  ```

## Rank System

Ranks are ordered from lowest to highest:
- **F** - Lowest rank
- **E**
- **D**
- **C**
- **B**
- **A**
- **S**
- **SS**
- **SSS** - Highest rank

### Rank Rules

- A member with rank **B** can accept quests ranked: B, C, D, E, F
- A member with rank **F** can only accept **F** quests
- A member with rank **SSS** can accept **any** quest

## Testing

Run the test suite:
```bash
npm test
```

The tests cover:
- Rank utility functions
- Member API endpoints
- Quest API endpoints
- Quest acceptance with rank validation

## Database Schema

### Members Table
- `id` - Primary key
- `name` - Member name
- `rank` - Member rank (F → SSS)
- `referrer_id` - Foreign key to another member (nullable)
- `created_at` - Timestamp

### Quests Table
- `id` - Primary key
- `title` - Quest title
- `description` - Quest description
- `rank_required` - Minimum rank required (F → SSS)
- `posted_by_member_id` - Foreign key to members
- `created_at` - Timestamp

### Quest Acceptances Table
- `id` - Primary key
- `quest_id` - Foreign key to quests
- `member_id` - Foreign key to members
- `accepted_at` - Timestamp

## License

ISC
