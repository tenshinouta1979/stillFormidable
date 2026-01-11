const request = require('supertest');
const app = require('../src/app');
const { setupTestDatabase, teardownTestDatabase } = require('./testHelper');
const pool = require('../db');

describe('Quests API', () => {
  let member;

  beforeEach(async () => {
    await setupTestDatabase();
    
    // Create a member for posting quests
    const response = await request(app)
      .post('/members')
      .send({
        name: 'Quest Poster',
        rank: 'A'
      });
    member = response.body;
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await pool.end();
  });

  describe('POST /quests', () => {
    it('should create a new quest', async () => {
      const response = await request(app)
        .post('/quests')
        .send({
          title: 'Defeat the Dragon',
          description: 'A dangerous dragon has appeared',
          rank_required: 'S',
          posted_by_member_id: member.id
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Defeat the Dragon');
      expect(response.body.description).toBe('A dangerous dragon has appeared');
      expect(response.body.rank_required).toBe('S');
      expect(response.body.posted_by_member_id).toBe(member.id);
    });

    it('should default to rank F if not specified', async () => {
      const response = await request(app)
        .post('/quests')
        .send({
          title: 'Simple Quest',
          posted_by_member_id: member.id
        });

      expect(response.status).toBe(201);
      expect(response.body.rank_required).toBe('F');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/quests')
        .send({
          posted_by_member_id: member.id
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });

    it('should return 400 if posted_by_member_id is missing', async () => {
      const response = await request(app)
        .post('/quests')
        .send({
          title: 'Quest'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('posted_by_member_id is required');
    });

    it('should return 400 if rank_required is invalid', async () => {
      const response = await request(app)
        .post('/quests')
        .send({
          title: 'Quest',
          rank_required: 'Z',
          posted_by_member_id: member.id
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid rank_required');
    });

    it('should return 404 if member does not exist', async () => {
      const response = await request(app)
        .post('/quests')
        .send({
          title: 'Quest',
          posted_by_member_id: 9999
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Member not found');
    });
  });

  describe('GET /quests', () => {
    it('should return all quests sorted by newest', async () => {
      // Create multiple quests
      await request(app)
        .post('/quests')
        .send({
          title: 'Quest 1',
          rank_required: 'F',
          posted_by_member_id: member.id
        });

      await request(app)
        .post('/quests')
        .send({
          title: 'Quest 2',
          rank_required: 'B',
          posted_by_member_id: member.id
        });

      await request(app)
        .post('/quests')
        .send({
          title: 'Quest 3',
          rank_required: 'SSS',
          posted_by_member_id: member.id
        });

      // Get all quests
      const response = await request(app).get('/quests');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe('Quest 3'); // Newest first
      expect(response.body[1].title).toBe('Quest 2');
      expect(response.body[2].title).toBe('Quest 1');
    });

    it('should return empty array if no quests', async () => {
      const response = await request(app).get('/quests');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /quests/:id', () => {
    it('should return a single quest', async () => {
      // Create a quest
      const created = await request(app)
        .post('/quests')
        .send({
          title: 'Test Quest',
          description: 'A test quest',
          rank_required: 'C',
          posted_by_member_id: member.id
        });

      // Get the quest
      const response = await request(app)
        .get(`/quests/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(created.body.id);
      expect(response.body.title).toBe('Test Quest');
      expect(response.body.rank_required).toBe('C');
    });

    it('should return 404 if quest not found', async () => {
      const response = await request(app).get('/quests/9999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Quest not found');
    });
  });

  describe('POST /quests/:id/accept', () => {
    let quest;
    let acceptingMember;

    beforeEach(async () => {
      // Create a quest
      const questResponse = await request(app)
        .post('/quests')
        .send({
          title: 'Rank B Quest',
          rank_required: 'B',
          posted_by_member_id: member.id
        });
      quest = questResponse.body;

      // Create a member to accept the quest
      const memberResponse = await request(app)
        .post('/members')
        .send({
          name: 'Accepting Member',
          rank: 'B'
        });
      acceptingMember = memberResponse.body;
    });

    it('should allow member with sufficient rank to accept quest', async () => {
      const response = await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({
          member_id: acceptingMember.id
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Quest accepted successfully');
      expect(response.body.acceptance).toHaveProperty('id');
      expect(response.body.acceptance.quest_id).toBe(quest.id);
      expect(response.body.acceptance.member_id).toBe(acceptingMember.id);
    });

    it('should allow SSS rank to accept any quest', async () => {
      // Create SSS member
      const sssResponse = await request(app)
        .post('/members')
        .send({
          name: 'SSS Member',
          rank: 'SSS'
        });

      const response = await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({
          member_id: sssResponse.body.id
        });

      expect(response.status).toBe(201);
    });

    it('should reject member with insufficient rank', async () => {
      // Create F rank member
      const fMember = await request(app)
        .post('/members')
        .send({
          name: 'F Member',
          rank: 'F'
        });

      const response = await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({
          member_id: fMember.body.id
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Member rank insufficient for this quest');
      expect(response.body.member_rank).toBe('F');
      expect(response.body.quest_rank_required).toBe('B');
    });

    it('should return 400 if member_id is missing', async () => {
      const response = await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('member_id is required');
    });

    it('should return 404 if quest not found', async () => {
      const response = await request(app)
        .post('/quests/9999/accept')
        .send({
          member_id: acceptingMember.id
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Quest not found');
    });

    it('should return 404 if member not found', async () => {
      const response = await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({
          member_id: 9999
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Member not found');
    });

    it('should return 409 if quest already accepted by member', async () => {
      // Accept quest first time
      await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({
          member_id: acceptingMember.id
        });

      // Try to accept again
      const response = await request(app)
        .post(`/quests/${quest.id}/accept`)
        .send({
          member_id: acceptingMember.id
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Quest already accepted by this member');
    });
  });
});
