import ASOD from '@asod/core';

const STRING_PRIMITIVE_METHOD_NAMES = ['toString', 'valueOf'];

const isObject = (value: unknown): value is ASOD.Object =>
  typeof value === 'object' && value !== null;

/** @ref ECMA-262 */
const ordinaryToString = (value: ASOD.Object): ASOD.Primitive => {
  for (const name of STRING_PRIMITIVE_METHOD_NAMES) {
    if (typeof value[name] === 'function') {
      const primitive = value[name]();

      if (!isObject(primitive)) return primitive;
    }
  }

  throw new TypeError('Cannot convert object to primitive value');
};

/** @ref ECMA-262 */
const toString = (value: unknown): string => {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'undefined':
      return String(value);

    case 'object': {
      if (value === null) return String(value);

      const toPrimitive =
        Symbol.toPrimitive in value ? value[Symbol.toPrimitive] : undefined;

      const primitive: ASOD.Primitive =
        typeof toPrimitive === 'function'
          ? toPrimitive('string')
          : ordinaryToString(value);

      if (isObject(primitive)) {
        throw new TypeError('Cannot convert object to primitive value');
      }

      return toString(primitive);
    }

    default:
      throw new TypeError(`Cannot convert ${typeof value} to string value`);
  }
};

/** @ref ECMA-262 */
const isLessThan = (a: string, b: string): boolean => {
  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i++) {
    const aChar = a.charCodeAt(i);
    const bChar = b.charCodeAt(i);

    if (aChar < bChar) return true;
    if (aChar > bChar) return false;
  }

  return a.length < b.length;
};

/**
 * Determines the order of the values.
 *
 * @param a Value to be compared with the value of parameter `b`.
 *
 * @param b Value to be compared with the value of parameter `a`.
 *
 * @param compare Function used to determine the order of the values. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
 *
 * @returns
 *    - `-1` if `a` is less than `b`
 *    - `0` if `a` and `b` are equal
 *    - `1` if `a` is more than `b`
 *
 * @example
 *
 * compare(1, 5); // -1
 * compare(1, 1); // 0
 * compare(5, 1); // 1
 *
 * compare(1, 5, (a, b) => b - a); // 1
 *
 * @ref ECMA-262
 */
const compare: ASOD.Comparator = (a, b, predicate) => {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;

  if (predicate) return predicate(a, b) || 0;

  const aString = toString(a);
  const bString = toString(b);

  if (isLessThan(aString, bString)) return -1;
  if (isLessThan(bString, aString)) return 1;
  return 0;
};

export { compare };
export default compare;
