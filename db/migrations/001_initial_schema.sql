-- Create rank enum type
CREATE TYPE rank_enum AS ENUM ('F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS');

-- Create members table
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rank rank_enum NOT NULL DEFAULT 'F',
  referrer_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on referrer_id for efficient referral queries
CREATE INDEX idx_members_referrer_id ON members(referrer_id);

-- Create quests table
CREATE TABLE quests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  rank_required rank_enum NOT NULL DEFAULT 'F',
  posted_by_member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on posted_by_member_id for efficient queries
CREATE INDEX idx_quests_posted_by ON quests(posted_by_member_id);

-- Create index on created_at for sorting by newest
CREATE INDEX idx_quests_created_at ON quests(created_at DESC);

-- Create quest_acceptances table for tracking who accepts quests
CREATE TABLE quest_acceptances (
  id SERIAL PRIMARY KEY,
  quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(quest_id, member_id)
);

-- Create indexes for quest_acceptances
CREATE INDEX idx_quest_acceptances_quest_id ON quest_acceptances(quest_id);
CREATE INDEX idx_quest_acceptances_member_id ON quest_acceptances(member_id);
