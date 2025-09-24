const { EvaluationService } = require('../../src/services/evaluationService');

describe('EvaluationService', () => {
  let evaluationService;

  beforeEach(() => {
    evaluationService = new EvaluationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startEvaluation', () => {
    it('should start a new evaluation successfully', async () => {
      const params = {
        type: 'driving',
        difficulty: 'medium',
        environment: 'simulation'
      };

      const result = await evaluationService.startEvaluation(params);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('evaluationId');
      expect(result.evaluationId).toMatch(/^eval_\d+$/);
    });

    it('should handle invalid evaluation parameters', async () => {
      const params = {
        type: 'invalid_type',
        difficulty: 'medium',
        environment: 'simulation'
      };

      const result = await evaluationService.startEvaluation(params);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('error');
    });

    it('should generate unique evaluation IDs', async () => {
      const params = {
        type: 'driving',
        difficulty: 'medium',
        environment: 'simulation'
      };

      const result1 = await evaluationService.startEvaluation(params);
      const result2 = await evaluationService.startEvaluation(params);

      expect(result1.evaluationId).not.toBe(result2.evaluationId);
    });
  });

  describe('getEvaluationStatus', () => {
    it('should return status for existing evaluation', async () => {
      const params = {
        type: 'driving',
        difficulty: 'medium',
        environment: 'simulation'
      };

      const startResult = await evaluationService.startEvaluation(params);
      const status = await evaluationService.getEvaluationStatus(startResult.evaluationId);

      expect(status).toHaveProperty('id', startResult.evaluationId);
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('progress');
    });

    it('should return null for non-existent evaluation', async () => {
      const status = await evaluationService.getEvaluationStatus('non_existent_id');
      expect(status).toBeNull();
    });
  });

  describe('stopEvaluation', () => {
    it('should stop running evaluation', async () => {
      const params = {
        type: 'driving',
        difficulty: 'medium',
        environment: 'simulation'
      };

      const startResult = await evaluationService.startEvaluation(params);
      const stopResult = await evaluationService.stopEvaluation(startResult.evaluationId);

      expect(stopResult).toHaveProperty('success', true);
    });

    it('should handle stopping non-existent evaluation', async () => {
      const stopResult = await evaluationService.stopEvaluation('non_existent_id');

      expect(stopResult).toHaveProperty('success', false);
      expect(stopResult).toHaveProperty('error');
    });
  });
});