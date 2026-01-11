const { RANKS, getRankValue, canAcceptQuest, isValidRank } = require('../src/utils/ranks');

describe('Rank Utilities', () => {
  describe('getRankValue', () => {
    it('should return correct values for all ranks', () => {
      expect(getRankValue('F')).toBe(0);
      expect(getRankValue('E')).toBe(1);
      expect(getRankValue('D')).toBe(2);
      expect(getRankValue('C')).toBe(3);
      expect(getRankValue('B')).toBe(4);
      expect(getRankValue('A')).toBe(5);
      expect(getRankValue('S')).toBe(6);
      expect(getRankValue('SS')).toBe(7);
      expect(getRankValue('SSS')).toBe(8);
    });

    it('should return -1 for invalid rank', () => {
      expect(getRankValue('Z')).toBe(-1);
    });
  });

  describe('isValidRank', () => {
    it('should return true for valid ranks', () => {
      RANKS.forEach(rank => {
        expect(isValidRank(rank)).toBe(true);
      });
    });

    it('should return false for invalid ranks', () => {
      expect(isValidRank('Z')).toBe(false);
      expect(isValidRank('AA')).toBe(false);
      expect(isValidRank('')).toBe(false);
    });
  });

  describe('canAcceptQuest', () => {
    it('should allow SSS rank to accept any quest', () => {
      RANKS.forEach(rank => {
        expect(canAcceptQuest('SSS', rank)).toBe(true);
      });
    });

    it('should allow F rank to only accept F quests', () => {
      expect(canAcceptQuest('F', 'F')).toBe(true);
      expect(canAcceptQuest('F', 'E')).toBe(false);
      expect(canAcceptQuest('F', 'D')).toBe(false);
      expect(canAcceptQuest('F', 'SSS')).toBe(false);
    });

    it('should allow B rank to accept B, C, D, E, F quests', () => {
      expect(canAcceptQuest('B', 'F')).toBe(true);
      expect(canAcceptQuest('B', 'E')).toBe(true);
      expect(canAcceptQuest('B', 'D')).toBe(true);
      expect(canAcceptQuest('B', 'C')).toBe(true);
      expect(canAcceptQuest('B', 'B')).toBe(true);
      expect(canAcceptQuest('B', 'A')).toBe(false);
      expect(canAcceptQuest('B', 'S')).toBe(false);
    });

    it('should allow A rank to accept up to A quests', () => {
      expect(canAcceptQuest('A', 'F')).toBe(true);
      expect(canAcceptQuest('A', 'A')).toBe(true);
      expect(canAcceptQuest('A', 'S')).toBe(false);
      expect(canAcceptQuest('A', 'SS')).toBe(false);
      expect(canAcceptQuest('A', 'SSS')).toBe(false);
    });
  });
});
