const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { isValidRank, canAcceptQuest } = require('../utils/ranks');

// POST /quests - Create a new quest
router.post('/', async (req, res) => {
  try {
    const { title, description, rank_required = 'F', posted_by_member_id } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!posted_by_member_id) {
      return res.status(400).json({ error: 'posted_by_member_id is required' });
    }

    // Validate rank
    if (!isValidRank(rank_required)) {
      return res.status(400).json({ error: 'Invalid rank_required' });
    }

    // Verify that the member exists
    const memberCheck = await pool.query(
      'SELECT id FROM members WHERE id = $1',
      [posted_by_member_id]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Insert the new quest
    const result = await pool.query(
      'INSERT INTO quests (title, description, rank_required, posted_by_member_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, rank_required, posted_by_member_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /quests - List all quests (sorted by newest)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM quests ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /quests/:id - Get a single quest
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM quests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /quests/:id/accept - Accept a quest
router.post('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { member_id } = req.body;

    // Validate required fields
    if (!member_id) {
      return res.status(400).json({ error: 'member_id is required' });
    }

    // Get the quest
    const questResult = await pool.query(
      'SELECT * FROM quests WHERE id = $1',
      [id]
    );

    if (questResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    const quest = questResult.rows[0];

    // Get the member
    const memberResult = await pool.query(
      'SELECT * FROM members WHERE id = $1',
      [member_id]
    );

    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = memberResult.rows[0];

    // Check rank eligibility
    if (!canAcceptQuest(member.rank, quest.rank_required)) {
      return res.status(403).json({ 
        error: 'Member rank insufficient for this quest',
        member_rank: member.rank,
        quest_rank_required: quest.rank_required
      });
    }

    // Check if already accepted
    const acceptanceCheck = await pool.query(
      'SELECT id FROM quest_acceptances WHERE quest_id = $1 AND member_id = $2',
      [id, member_id]
    );

    if (acceptanceCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Quest already accepted by this member' });
    }

    // Insert the acceptance
    const result = await pool.query(
      'INSERT INTO quest_acceptances (quest_id, member_id) VALUES ($1, $2) RETURNING *',
      [id, member_id]
    );

    res.status(201).json({
      message: 'Quest accepted successfully',
      acceptance: result.rows[0]
    });
  } catch (error) {
    console.error('Error accepting quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
