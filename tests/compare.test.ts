import defaultCompare, { compare } from '../src';

describe('compare', () => {
  it('should default function be exported', () => {
    expect(typeof defaultCompare).toBe('function');
  });

  it('should named function be exported', () => {
    expect(typeof compare).toBe('function');
  });

  it('should named and default functions be equal', () => {
    expect(defaultCompare).toEqual(compare);
  });

  it('should return `-1` for numeric values', () => {
    expect(compare(1, 5)).toBe(-1);
  });

  it('should return `-1` for string values', () => {
    expect(compare('80', '9')).toBe(-1);
  });

  it('should return `-1` for string and numeric values', () => {
    expect(compare('80', 9)).toBe(-1);
  });

  it('should return `-1` for object values', () => {
    const foo = { [Symbol.toPrimitive]: () => 1 };
    const bar = { [Symbol.toPrimitive]: () => 5 };

    expect(compare(foo, bar)).toBe(-1);
  });

  it('should return `0` for numeric values', () => {
    expect(compare(1, 1)).toBe(0);
  });

  it('should return `0` for string values', () => {
    expect(compare('foo', 'foo')).toBe(0);
  });

  it('should return `0` for string and numeric values', () => {
    expect(compare('1', 1)).toBe(0);
  });

  it('should return `0` for object values', () => {
    const foo = { [Symbol.toPrimitive]: () => 1 };
    const bar = { [Symbol.toPrimitive]: () => 1 };

    expect(compare(foo, bar)).toBe(0);
  });

  it('should return `1` for numeric values', () => {
    expect(compare(5, 1)).toBe(1);
  });

  it('should return `1` for string values', () => {
    expect(compare('9', '80')).toBe(1);
  });

  it('should return `1` for string and numeric values', () => {
    expect(compare(9, '80')).toBe(1);
  });

  it('should return `1` for object values', () => {
    const foo = { [Symbol.toPrimitive]: () => 5 };
    const bar = { [Symbol.toPrimitive]: () => 1 };

    expect(compare(foo, bar)).toBe(1);
  });
});
