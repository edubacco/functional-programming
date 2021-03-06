/*

  Modellare il lancio di dadi di un gioco di ruolo.

*/
import { pipe } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import { Monoid } from 'fp-ts/Monoid'
import * as R from 'fp-ts/Random'

// ------------------------------------
// model
// ------------------------------------

export interface Die extends IO.IO<number> {}

// ------------------------------------
// constructors
// ------------------------------------

export const die = (faces: number): Die => R.randomInt(1, faces)

// ------------------------------------
// combinators
// ------------------------------------

export const modifier = (n: number) => (die: Die): Die =>
  pipe(
    die,
    IO.map((m) => m + n)
  )

export const add = (second: Die) => (first: Die): Die =>
  pipe(
    first,
    IO.map((a: number) => (b: number) => a + b),
    IO.ap(second)
  )

export const multiply = (n: number) => (die: Die): Die =>
  pipe(
    die,
    IO.map((m) => m * n)
  )

// ------------------------------------
// instances
// ------------------------------------

export const monoidDie: Monoid<Die> = {
  concat: add,
  empty: () => 0 // <= un dado con zero facce
}

// ------------------------------------
// tests
// ------------------------------------

const d6 = die(6)
const d8 = die(8)

// 2d6 + 1d8 + 2
const _2d6_1d8_2 = pipe(d6, multiply(2), add(d8), modifier(2))

console.log(_2d6_1d8_2())
