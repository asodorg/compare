type Primitive = number | bigint | string | symbol | boolean | null | undefined;
type AnyObject = Record<string | symbol | number, any>;

type PreferredType = 'string' | 'number';
type Hint = 'string' | 'number' | 'default';

type Predicate<TA = unknown, TB = TA> = (a: TA, b: TB) => number;
type Comparator = <TA = unknown, TB = TA>(
  a: TA,
  b: TB,
  predicate?: Predicate<TA, TB>,
) => number;

const STRING_PRIMITIVE_METHOD_NAMES = ['toString', 'valueOf'];
const NON_STRING_PRIMITIVE_METHOD_NAMES = ['valueOf', 'toString'];

const isString = (value: unknown): value is string => typeof value === 'string';
const isBigint = (value: unknown): value is bigint => typeof value === 'bigint';
const isObject = (value: unknown): value is AnyObject =>
  typeof value === 'object' && value !== null;

const isBigintString = (value: string) => /^\d+(\.\d+)?n?$/u.test(value);

/** @ref ECMA-262 */
const stringToBigint = (value: string) => BigInt(value.replace(/n$/, ''));

/** @ref ECMA-262 */
const ordinaryToPrimitive = (value: AnyObject, hint: Hint): Primitive => {
  const methodNames =
    hint === 'string'
      ? STRING_PRIMITIVE_METHOD_NAMES
      : NON_STRING_PRIMITIVE_METHOD_NAMES;

  for (const name of methodNames) {
    if (typeof value[name] === 'function') {
      const primitive = value[name]();

      if (!isObject(primitive)) return primitive;
    }
  }

  throw new TypeError('Cannot convert object to primitive value');
};

/** @ref ECMA-262 */
const toPrimitive = (
  value: unknown,
  preferredType?: PreferredType,
): Primitive => {
  if (!isObject(value)) return value as Primitive;

  if (typeof value[Symbol.toPrimitive] === 'function') {
    const primitive = value[Symbol.toPrimitive](preferredType ?? 'default');

    if (!isObject(primitive)) return primitive;
    throw new TypeError('Cannot convert object to primitive value');
  }

  return ordinaryToPrimitive(value, preferredType ?? 'number');
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

    case 'object':
      if (value === null) return String(value);
      return toString(toPrimitive(value, 'string'));

    default:
      throw new TypeError(`Cannot convert ${typeof value} to string value`);
  }
};

/** @ref ECMA-262 */
const toNumeric = (value: unknown): number | bigint => {
  const primitive = toPrimitive(value, 'number');

  return isBigint(primitive) ? primitive : Number(primitive);
};

/** @ref ECMA-262 */
const isLessThan = (
  a: unknown,
  b: unknown,
  isLeftFirst: boolean = true,
): boolean | undefined => {
  let aPrimitive: Primitive;
  let bPrimitive: Primitive;

  if (isLeftFirst) {
    aPrimitive = toPrimitive(a);
    bPrimitive = toPrimitive(b);
  } else {
    bPrimitive = toPrimitive(b);
    aPrimitive = toPrimitive(a);
  }

  if (isString(aPrimitive) && isString(bPrimitive)) {
    const length = Math.min(aPrimitive.length, bPrimitive.length);

    for (let i = 0; i < length; i++) {
      const aChar = aPrimitive.charCodeAt(i);
      const bChar = bPrimitive.charCodeAt(i);

      if (aChar < bChar) return true;
      if (aChar > bChar) return false;
    }

    return aPrimitive.length < bPrimitive.length;
  }

  if (isBigint(aPrimitive) && isString(bPrimitive)) {
    if (!isBigintString(bPrimitive)) return undefined;

    return aPrimitive < stringToBigint(bPrimitive);
  }

  if (isString(aPrimitive) && isBigint(bPrimitive)) {
    if (!isBigintString(aPrimitive)) return undefined;

    return stringToBigint(aPrimitive) < bPrimitive;
  }

  const aNumeric = toNumeric(aPrimitive);
  const bNumeric = toNumeric(bPrimitive);

  if (Number.isNaN(aNumeric) || Number.isNaN(bNumeric)) return undefined;

  return aNumeric < bNumeric;
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
const compare: Comparator = (a, b, predicate) => {
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

export { compare, type Predicate, type Comparator };
export default compare;
