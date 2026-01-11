const pool = require('../db');

async function cleanupTestData() {
  // Clean up data in correct order (respecting foreign keys)
  await pool.query('DELETE FROM quest_acceptances');
  await pool.query('DELETE FROM quests');
  await pool.query('DELETE FROM members');
}

async function setupTestDatabase() {
  await cleanupTestData();
  
  // Reset sequences
  await pool.query('ALTER SEQUENCE members_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE quests_id_seq RESTART WITH 1');
  await pool.query('ALTER SEQUENCE quest_acceptances_id_seq RESTART WITH 1');
}

async function teardownTestDatabase() {
  await cleanupTestData();
}

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
};
