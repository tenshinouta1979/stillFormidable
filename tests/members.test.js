const request = require('supertest');
const app = require('../src/app');
const { setupTestDatabase, teardownTestDatabase } = require('./testHelper');
const pool = require('../db');

describe('Members API', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await pool.end();
  });

  describe('POST /members', () => {
    it('should create a new member without referrer', async () => {
      const response = await request(app)
        .post('/members')
        .send({
          name: 'John Doe',
          rank: 'B'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.rank).toBe('B');
      expect(response.body.referrer_id).toBeNull();
    });

    it('should create a new member with referrer', async () => {
      // Create first member
      const referrer = await request(app)
        .post('/members')
        .send({
          name: 'Referrer',
          rank: 'A'
        });

      // Create second member with referrer
      const response = await request(app)
        .post('/members')
        .send({
          name: 'Referred Member',
          rank: 'C',
          referrer_id: referrer.body.id
        });

      expect(response.status).toBe(201);
      expect(response.body.referrer_id).toBe(referrer.body.id);
    });

    it('should default to rank F if not specified', async () => {
      const response = await request(app)
        .post('/members')
        .send({
          name: 'Default Rank'
        });

      expect(response.status).toBe(201);
      expect(response.body.rank).toBe('F');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/members')
        .send({
          rank: 'A'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
    });

    it('should return 400 if rank is invalid', async () => {
      const response = await request(app)
        .post('/members')
        .send({
          name: 'Invalid Rank',
          rank: 'Z'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid rank');
    });

    it('should return 404 if referrer does not exist', async () => {
      const response = await request(app)
        .post('/members')
        .send({
          name: 'Member',
          referrer_id: 9999
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Referrer not found');
    });
  });

  describe('GET /members/:id', () => {
    it('should return member profile', async () => {
      // Create a member
      const created = await request(app)
        .post('/members')
        .send({
          name: 'Test Member',
          rank: 'S'
        });

      // Get the member
      const response = await request(app)
        .get(`/members/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(created.body.id);
      expect(response.body.name).toBe('Test Member');
      expect(response.body.rank).toBe('S');
    });

    it('should return 404 if member not found', async () => {
      const response = await request(app)
        .get('/members/9999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Member not found');
    });
  });

  describe('GET /members/:id/referrals', () => {
    it('should return empty array if no referrals', async () => {
      // Create a member
      const member = await request(app)
        .post('/members')
        .send({
          name: 'Member',
          rank: 'A'
        });

      // Get referrals
      const response = await request(app)
        .get(`/members/${member.body.id}/referrals`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all members referred by a member', async () => {
      // Create referrer
      const referrer = await request(app)
        .post('/members')
        .send({
          name: 'Referrer',
          rank: 'SSS'
        });

      // Create referred members
      await request(app)
        .post('/members')
        .send({
          name: 'Referred 1',
          rank: 'B',
          referrer_id: referrer.body.id
        });

      await request(app)
        .post('/members')
        .send({
          name: 'Referred 2',
          rank: 'C',
          referrer_id: referrer.body.id
        });

      // Get referrals
      const response = await request(app)
        .get(`/members/${referrer.body.id}/referrals`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Referred 2'); // Sorted by created_at DESC
      expect(response.body[1].name).toBe('Referred 1');
    });

    it('should return 404 if member not found', async () => {
      const response = await request(app)
        .get('/members/9999/referrals');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Member not found');
    });
  });
});
