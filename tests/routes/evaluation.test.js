const request = require('supertest');
const express = require('express');
const evaluationRoutes = require('../../src/routes/evaluation');

describe('Evaluation Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/evaluations', evaluationRoutes);
  });

  describe('POST /api/evaluations/start', () => {
    it('should start a new evaluation', async () => {
      const evaluationData = {
        type: 'driving',
        difficulty: 'medium',
        environment: 'simulation'
      };

      const response = await request(app)
        .post('/api/evaluations/start')
        .send(evaluationData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('evaluationId');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/evaluations/start')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/evaluations/:id', () => {
    it('should return evaluation details', async () => {
      // First create an evaluation
      const createResponse = await request(app)
        .post('/api/evaluations/start')
        .send({
          type: 'driving',
          difficulty: 'medium',
          environment: 'simulation'
        });

      const evaluationId = createResponse.body.evaluationId;

      // Then get its details
      const response = await request(app)
        .get(`/api/evaluations/${evaluationId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', evaluationId);
      expect(response.body).toHaveProperty('status');
    });

    it('should return 404 for non-existent evaluation', async () => {
      await request(app)
        .get('/api/evaluations/non_existent_id')
        .expect(404);
    });
  });

  describe('POST /api/evaluations/:id/stop', () => {
    it('should stop running evaluation', async () => {
      // First create an evaluation
      const createResponse = await request(app)
        .post('/api/evaluations/start')
        .send({
          type: 'driving',
          difficulty: 'medium',
          environment: 'simulation'
        });

      const evaluationId = createResponse.body.evaluationId;

      // Then stop it
      const response = await request(app)
        .post(`/api/evaluations/${evaluationId}/stop`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/evaluations/recent', () => {
    it('should return recent evaluations', async () => {
      const response = await request(app)
        .get('/api/evaluations/recent')
        .expect(200);

      expect(response.body).toHaveProperty('evaluations');
      expect(Array.isArray(response.body.evaluations)).toBe(true);
    });
  });
});