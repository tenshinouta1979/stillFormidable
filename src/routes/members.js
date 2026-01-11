const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { isValidRank } = require('../utils/ranks');

// POST /members - Create a new member
router.post('/', async (req, res) => {
  try {
    const { name, rank = 'F', referrer_id } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Validate rank
    if (!isValidRank(rank)) {
      return res.status(400).json({ error: 'Invalid rank' });
    }

    // If referrer_id is provided, validate it exists
    if (referrer_id) {
      const referrerCheck = await pool.query(
        'SELECT id FROM members WHERE id = $1',
        [referrer_id]
      );
      
      if (referrerCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Referrer not found' });
      }
    }

    // Insert the new member
    const result = await pool.query(
      'INSERT INTO members (name, rank, referrer_id) VALUES ($1, $2, $3) RETURNING *',
      [name, rank, referrer_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /members/:id - Get member profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM members WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /members/:id/referrals - Get members referred by this member
router.get('/:id/referrals', async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the member exists
    const memberCheck = await pool.query(
      'SELECT id FROM members WHERE id = $1',
      [id]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Get all members referred by this member
    const result = await pool.query(
      'SELECT * FROM members WHERE referrer_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
