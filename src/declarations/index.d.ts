/// <reference path="global.d.ts" />

import ASOD from '@asod/core';

declare module '@asod/core' {
  type Predicate<TA = unknown, TB = TA> = (a: TA, b: TB) => number;

  type Comparator = <TA = unknown, TB = TA>(
    a: TA,
    b: TB,
    predicate?: Predicate<TA, TB>,
  ) => number;
}

export = ASOD;
export as namespace ASOD;
