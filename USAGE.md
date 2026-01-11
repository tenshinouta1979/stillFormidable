# API Usage Examples

This document provides examples of how to use the Still Formidable API endpoints.

## Prerequisites

Make sure the server is running:
```bash
npm start
```

The server will be available at `http://localhost:3000`

## Examples using cURL

### 1. Create Members

#### Create a root member (no referrer)
```bash
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Master Swordsman",
    "rank": "SSS"
  }'
```

Response:
```json
{
  "id": 1,
  "name": "Master Swordsman",
  "rank": "SSS",
  "referrer_id": null,
  "created_at": "2024-01-11T22:00:00.000Z"
}
```

#### Create a member with a referrer
```bash
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apprentice Fighter",
    "rank": "B",
    "referrer_id": 1
  }'
```

### 2. View Member Profile

```bash
curl http://localhost:3000/members/1
```

### 3. View Member Referrals

```bash
curl http://localhost:3000/members/1/referrals
```

This returns all members referred by member #1.

### 4. Create Quests

```bash
curl -X POST http://localhost:3000/quests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Defeat the Ancient Dragon",
    "description": "A fearsome dragon threatens the village",
    "rank_required": "S",
    "posted_by_member_id": 1
  }'
```

Response:
```json
{
  "id": 1,
  "title": "Defeat the Ancient Dragon",
  "description": "A fearsome dragon threatens the village",
  "rank_required": "S",
  "posted_by_member_id": 1,
  "created_at": "2024-01-11T22:00:00.000Z"
}
```

### 5. List All Quests

```bash
curl http://localhost:3000/quests
```

Returns all quests sorted by newest first.

### 6. View Single Quest

```bash
curl http://localhost:3000/quests/1
```

### 7. Accept a Quest

```bash
curl -X POST http://localhost:3000/quests/1/accept \
  -H "Content-Type: application/json" \
  -d '{
    "member_id": 1
  }'
```

Successful response:
```json
{
  "message": "Quest accepted successfully",
  "acceptance": {
    "id": 1,
    "quest_id": 1,
    "member_id": 1,
    "accepted_at": "2024-01-11T22:00:00.000Z"
  }
}
```

Error response (insufficient rank):
```json
{
  "error": "Member rank insufficient for this quest",
  "member_rank": "F",
  "quest_rank_required": "S"
}
```

## Complete Workflow Example

Here's a complete example showing the entire workflow:

```bash
# 1. Create a guild master (SSS rank, no referrer)
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Guild Master", "rank": "SSS"}'

# 2. Create a veteran member referred by the guild master
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Veteran Warrior", "rank": "A", "referrer_id": 1}'

# 3. Create a novice member referred by the veteran
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Novice Fighter", "rank": "C", "referrer_id": 2}'

# 4. Guild master posts a high-rank quest
curl -X POST http://localhost:3000/quests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Slay the Demon Lord",
    "description": "The demon lord threatens all of humanity",
    "rank_required": "SS",
    "posted_by_member_id": 1
  }'

# 5. Guild master posts a low-rank quest
curl -X POST http://localhost:3000/quests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gather Herbs",
    "description": "Collect medicinal herbs from the forest",
    "rank_required": "D",
    "posted_by_member_id": 1
  }'

# 6. List all quests
curl http://localhost:3000/quests

# 7. Guild master accepts the high-rank quest (will succeed - SSS can do anything)
curl -X POST http://localhost:3000/quests/1/accept \
  -H "Content-Type: application/json" \
  -d '{"member_id": 1}'

# 8. Novice tries to accept the high-rank quest (will fail - C rank too low for SS quest)
curl -X POST http://localhost:3000/quests/1/accept \
  -H "Content-Type: application/json" \
  -d '{"member_id": 3}'

# 9. Novice accepts the low-rank quest (will succeed - C rank can do D quests)
curl -X POST http://localhost:3000/quests/2/accept \
  -H "Content-Type: application/json" \
  -d '{"member_id": 3}'

# 10. View all members referred by the guild master
curl http://localhost:3000/members/1/referrals
```

## Rank System Rules

- **F** (lowest) → **E** → **D** → **C** → **B** → **A** → **S** → **SS** → **SSS** (highest)

### Quest Acceptance Rules

- A member can only accept quests at or **below** their rank
- Examples:
  - **F rank**: Can only accept **F** quests
  - **B rank**: Can accept **B, C, D, E, F** quests
  - **SSS rank**: Can accept **any** quest

## Error Responses

### 400 Bad Request
Missing required fields or invalid data:
```json
{
  "error": "Name is required"
}
```

### 403 Forbidden
Insufficient rank for quest:
```json
{
  "error": "Member rank insufficient for this quest",
  "member_rank": "F",
  "quest_rank_required": "B"
}
```

### 404 Not Found
Resource doesn't exist:
```json
{
  "error": "Member not found"
}
```

### 409 Conflict
Duplicate action:
```json
{
  "error": "Quest already accepted by this member"
}
```

### 429 Too Many Requests
Rate limit exceeded:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

## Rate Limiting

The API is rate-limited to 100 requests per 15 minutes per IP address. If you exceed this limit, you'll receive a 429 status code and need to wait before making more requests.
