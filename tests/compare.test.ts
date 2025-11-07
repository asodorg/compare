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

  it('should return `-1` for string and null values', () => {
    expect(compare('a', null)).toBe(-1);
  });

  it('should return `-1` for string and undefined values', () => {
    expect(compare('a', undefined)).toBe(-1);
  });

  it('should return `-1` for converted object values', () => {
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

  it('should return `0` for string and null values', () => {
    expect(compare('null', null)).toBe(0);
  });

  it('should return `0` for undefined values', () => {
    expect(compare(undefined, undefined)).toBe(0);
  });

  it('should return `0` for non-converted object values', () => {
    const foo = { bar: 1 };
    const baz = { qux: 5 };

    expect(compare(foo, baz)).toBe(0);
  });

  it('should return `0` for converted object values', () => {
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

  it('should return `1` for numeric and string values', () => {
    expect(compare(9, '80')).toBe(1);
  });

  it('should return `1` for string and null values', () => {
    expect(compare('o', null)).toBe(1);
  });

  it('should return `1` for undefined and string values', () => {
    expect(compare(undefined, 'a')).toBe(1);
  });

  it('should return `1` for converted object values', () => {
    const foo = { [Symbol.toPrimitive]: () => 5 };
    const bar = { [Symbol.toPrimitive]: () => 1 };

    expect(compare(foo, bar)).toBe(1);
  });

  it('should throw error for non-primitive object value', () => {
    const foo = { [Symbol.toPrimitive]: () => ({}) };
    const bar = { [Symbol.toPrimitive]: () => 1 };

    // prettier-ignore
    expect(() => compare(foo, bar)).toThrow('Cannot convert object to primitive value');
  });

  it('should throw error for non-stringified object value', () => {
    const foo = { valueOf: undefined, toString: undefined };
    const bar = 5;

    // prettier-ignore
    expect(() => compare(foo, bar)).toThrow('Cannot convert object to primitive value');
  });

  it('should throw error for function value', () => {
    const foo = () => 1;
    const bar = 5;

    // prettier-ignore
    expect(() => compare(foo, bar)).toThrow('Cannot convert function to string value');
  });
});
