import { CustomFormatDatePipe } from "./customFormatDate.pipe";

describe('CustomFormatDatePipe', () => {
  let pipe: CustomFormatDatePipe;

  beforeEach(() => {
    pipe = new CustomFormatDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('valid date formatting', () => {
    it('should convert YYYY-MM-DD to DD/MM/YYYY', () => {
      expect(pipe.transform('2024-01-15')).toBe('15/01/2024');
    });

    it('should handle single digit day', () => {
      expect(pipe.transform('2024-01-05')).toBe('05/01/2024');
    });

    it('should handle single digit month', () => {
      expect(pipe.transform('2024-03-15')).toBe('15/03/2024');
    });

    it('should handle single digit day and month', () => {
      expect(pipe.transform('2024-01-01')).toBe('01/01/2024');
    });

    it('should handle double digit day and month', () => {
      expect(pipe.transform('2024-12-31')).toBe('31/12/2024');
    });

    it('should handle leap year date', () => {
      expect(pipe.transform('2024-02-29')).toBe('29/02/2024');
    });

    it('should handle start of year', () => {
      expect(pipe.transform('2024-01-01')).toBe('01/01/2024');
    });

    it('should handle end of year', () => {
      expect(pipe.transform('2024-12-31')).toBe('31/12/2024');
    });

    it('should handle different year formats', () => {
      expect(pipe.transform('2023-06-15')).toBe('15/06/2023');
      expect(pipe.transform('2025-11-20')).toBe('20/11/2025');
    });
  });

  describe('edge cases', () => {
    it('should return undefined when date is undefined', () => {
      expect(pipe.transform(undefined)).toBeUndefined();
    });

    it('should return undefined when date is not provided', () => {
      expect(pipe.transform()).toBeUndefined();
    });

    it('should return empty string when date is empty string', () => {
      expect(pipe.transform('')).toBe('');
    });
  });

  describe('invalid or malformed dates', () => {
    it('should handle date with missing day', () => {
      // This will still split and return, but output will be malformed
      const result = pipe.transform('2024-01');
      expect(result).toBeDefined();
    });

    it('should handle date with extra segments', () => {
      const result = pipe.transform('2024-01-15-extra');
      // Takes first 3 segments: day=15, month=01, year=2024
      expect(result).toBe('15/01/2024');
    });

    it('should handle date without hyphens', () => {
      const result = pipe.transform('20240115');
      // Will try to split but won't find hyphens
      expect(result).toBeDefined();
    });

    it('should handle date with different separator', () => {
      const result = pipe.transform('2024/01/15');
      // Won't split correctly on hyphens
      expect(result).toBeDefined();
    });

    it('should handle invalid date values', () => {
      // Invalid month (13)
      expect(pipe.transform('2024-13-01')).toBe('01/13/2024');
    });

    it('should handle invalid day values', () => {
      // Invalid day (32)
      expect(pipe.transform('2024-01-32')).toBe('32/01/2024');
    });
  });

  describe('boundary conditions', () => {
    it('should handle very old dates', () => {
      expect(pipe.transform('1900-01-01')).toBe('01/01/1900');
    });

    it('should handle future dates', () => {
      expect(pipe.transform('2099-12-31')).toBe('31/12/2099');
    });

    it('should handle dates with leading zeros', () => {
      expect(pipe.transform('2024-01-05')).toBe('05/01/2024');
    });

    it('should handle minimum valid date parts', () => {
      expect(pipe.transform('0001-01-01')).toBe('01/01/0001');
    });
  });

  describe('whitespace handling', () => {
    it('should handle date with leading whitespace', () => {
      const result = pipe.transform(' 2024-01-15');
      expect(result).toBeDefined();
    });

    it('should handle date with trailing whitespace', () => {
      const result = pipe.transform('2024-01-15 ');
      expect(result).toBeDefined();
    });

    it('should handle date with spaces between parts', () => {
      const result = pipe.transform('2024 - 01 - 15');
      expect(result).toBeDefined();
    });
  });

  describe('real-world date examples', () => {
    it('should format Christmas date', () => {
      expect(pipe.transform('2024-12-25')).toBe('25/12/2024');
    });

    it('should format New Year date', () => {
      expect(pipe.transform('2024-01-01')).toBe('01/01/2024');
    });

    it('should format Valentine\'s Day', () => {
      expect(pipe.transform('2024-02-14')).toBe('14/02/2024');
    });

    it('should format Halloween', () => {
      expect(pipe.transform('2024-10-31')).toBe('31/10/2024');
    });
  });

  describe('type coercion', () => {
    it('should handle null as input', () => {
      expect(pipe.transform(null as any)).toBe(null);
    });
  });
});