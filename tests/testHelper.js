const pool = require('../db');

async function setupTestDatabase() {
  // Clean up existing data
  await pool.query('DELETE FROM quest_acceptances');
  await pool.query('DELETE FROM quests');
  await pool.query('DELETE FROM members');
  
  // Reset sequences
  await pool.query('ALTER SEQUENCE members_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE quests_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE quest_acceptances_id_seq RESTART WITH 1');
}

async function teardownTestDatabase() {
  // Clean up test data
  await pool.query('DELETE FROM quest_acceptances');
  await pool.query('DELETE FROM quests');
  await pool.query('DELETE FROM members');
}

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
};
