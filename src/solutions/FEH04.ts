/**
 * Definire una istanza di `Semigroup` per `Either` che accumula gli errori
 */
import { Semigroup } from 'fp-ts/Semigroup'
import * as N from 'fp-ts/number'
import { Either, right, left, isLeft } from 'fp-ts/Either'
import * as Str from 'fp-ts/string'

const getSemigroup = <E, A>(
  SE: Semigroup<E>,
  SA: Semigroup<A>
): Semigroup<Either<E, A>> => ({
  concat: (second) => (first) =>
    isLeft(first)
      ? isLeft(second)
        ? left(pipe(first.left, SE.concat(second.left)))
        : first
      : isLeft(second)
      ? second
      : right(pipe(first.right, SA.concat(second.right)))
})

// ------------------------------------
// tests
// ------------------------------------

import * as assert from 'assert'
import { pipe } from 'fp-ts/function'

const S = getSemigroup(N.SemigroupSum, Str.Semigroup)

assert.deepStrictEqual(pipe(left(1), S.concat(left(2))), left(3))
assert.deepStrictEqual(pipe(right('a'), S.concat(left(2))), left(2))
assert.deepStrictEqual(pipe(left(1), S.concat(right('b'))), left(1))
assert.deepStrictEqual(pipe(right('a'), S.concat(right('b'))), right('ab'))
