import { FormatCountPipe } from "./formatCount.pipe";

describe('FormatCountPipe', () => {
  let pipe: FormatCountPipe;

  beforeEach(() => {
    pipe = new FormatCountPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('numbers less than 1000', () => {
    it('should return number as string without formatting for 0', () => {
      expect(pipe.transform(0)).toBe('0');
    });

    it('should return number as string without formatting for single digit', () => {
      expect(pipe.transform(5)).toBe('5');
    });

    it('should return number as string without formatting for double digits', () => {
      expect(pipe.transform(99)).toBe('99');
    });

    it('should return number as string without formatting for triple digits', () => {
      expect(pipe.transform(999)).toBe('999');
    });

    it('should not add K for 999', () => {
      const result = pipe.transform(999);
      expect(result).toBe('999');
      expect(result).not.toContain('K');
    });
  });

  describe('numbers at or above 1000', () => {
    it('should format 1000 as 1.00K', () => {
      expect(pipe.transform(1000)).toBe('1.00K');
    });

    it('should format 1500 as 1.50K', () => {
      expect(pipe.transform(1500)).toBe('1.50K');
    });

    it('should format 2000 as 2.00K', () => {
      expect(pipe.transform(2000)).toBe('2.00K');
    });

    it('should format 5000 as 5.00K', () => {
      expect(pipe.transform(5000)).toBe('5.00K');
    });

    it('should format 10000 as 10.00K', () => {
      expect(pipe.transform(10000)).toBe('10.00K');
    });

    it('should format 50000 as 50.00K', () => {
      expect(pipe.transform(50000)).toBe('50.00K');
    });

    it('should format 100000 as 100.00K', () => {
      expect(pipe.transform(100000)).toBe('100.00K');
    });

    it('should format 999000 as 999.00K', () => {
      expect(pipe.transform(999000)).toBe('999.00K');
    });

    it('should format 1000000 as 1000.00K', () => {
      expect(pipe.transform(1000000)).toBe('1000.00K');
    });
  });

  describe('decimal precision', () => {
    it('should round to 2 decimal places', () => {
      expect(pipe.transform(1234)).toBe('1.23K');
    });

    it('should handle rounding up', () => {
      expect(pipe.transform(1999)).toBe('2.00K');
    });

    it('should handle rounding down', () => {
      expect(pipe.transform(1234)).toBe('1.23K');
    });

    it('should show trailing zeros for whole numbers', () => {
      expect(pipe.transform(2000)).toBe('2.00K');
    });

    it('should format 1111 as 1.11K', () => {
      expect(pipe.transform(1111)).toBe('1.11K');
    });

    it('should format 1567 as 1.57K', () => {
      expect(pipe.transform(1567)).toBe('1.57K');
    });

    it('should format 9999 as 10.00K (rounded up)', () => {
      expect(pipe.transform(9999)).toBe('10.00K');
    });
  });

  describe('boundary cases', () => {
    it('should handle exactly 1000 (boundary)', () => {
      expect(pipe.transform(1000)).toBe('1.00K');
    });

    it('should handle 999 (just below boundary)', () => {
      expect(pipe.transform(999)).toBe('999');
    });

    it('should handle 1001 (just above boundary)', () => {
      expect(pipe.transform(1001)).toBe('1.00K');
    });
  });

  describe('negative numbers', () => {
    it('should handle negative number less than -1000', () => {
      expect(pipe.transform(-500)).toBe('-500');
    });

    it('should handle negative number at -1000', () => {
      expect(pipe.transform(-1000)).toBe('-1000');
    });

    it('should handle negative number greater than -1000', () => {
      expect(pipe.transform(-1500)).toBe('-1500');
    });

    it('should handle negative zero', () => {
      expect(pipe.transform(-0)).toBe('0');
    });
  });

  describe('decimal inputs', () => {
    it('should handle decimal number less than 1000', () => {
      expect(pipe.transform(999.99)).toBe('999.99');
    });

    it('should handle decimal number at or above 1000', () => {
      expect(pipe.transform(1500.75)).toBe('1.50K');
    });

    it('should round decimal properly', () => {
      expect(pipe.transform(1234.56)).toBe('1.23K');
    });
  });

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(pipe.transform(0)).toBe('0');
    });

    it('should handle very large numbers', () => {
      expect(pipe.transform(999999999)).toBe('999999.00K');
    });

    it('should handle 1 million', () => {
      expect(pipe.transform(1000000)).toBe('1000.00K');
    });

    it('should handle fractional thousands', () => {
      expect(pipe.transform(1250)).toBe('1.25K');
    });
  });

  describe('real-world examples', () => {
    it('should format typical view count (1.2K)', () => {
      expect(pipe.transform(1234)).toBe('1.23K');
    });

    it('should format popular video views (10K)', () => {
      expect(pipe.transform(10000)).toBe('10.00K');
    });

    it('should format viral content (100K)', () => {
      expect(pipe.transform(100000)).toBe('100.00K');
    });

    it('should format small channel subscribers', () => {
      expect(pipe.transform(500)).toBe('500');
    });

    it('should format growing channel (5K)', () => {
      expect(pipe.transform(5432)).toBe('5.43K');
    });
  });

  describe('special number cases', () => {
    it('should handle NaN', () => {
      const result = pipe.transform(NaN);
      expect(result).toBe('NaN');
    });

    it('should handle Infinity', () => {
      const result = pipe.transform(Infinity);
      expect(result).toBe('Infinity');
    });

    it('should handle negative Infinity', () => {
      const result = pipe.transform(-Infinity);
      expect(result).toBe('-Infinity');
    });
  });

  describe('formatting consistency', () => {
    it('should always append K for numbers >= 1000', () => {
      const result1 = pipe.transform(1000);
      const result2 = pipe.transform(5000);
      const result3 = pipe.transform(999999);
      
      expect(result1).toContain('K');
      expect(result2).toContain('K');
      expect(result3).toContain('K');
    });

    it('should never append K for numbers < 1000', () => {
      const result1 = pipe.transform(0);
      const result2 = pipe.transform(500);
      const result3 = pipe.transform(999);
      
      expect(result1).not.toContain('K');
      expect(result2).not.toContain('K');
      expect(result3).not.toContain('K');
    });

    it('should always show 2 decimal places for K-formatted numbers', () => {
      const result = pipe.transform(1000);
      const decimalPart = result.split('.')[1];
      expect(decimalPart).toBe('00K');
    });
  });
});