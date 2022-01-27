export type ColorType =
  | 'primary'
  | 'secondary'
  | 'purple'
  | 'yellow'
  | 'pink'
  | 'blue'
  | 'blueLight'
  | 'green'
  | 'orange'
  | 'cyan'
  | 'gray'
  | 'red'

export type ArrayLengthMutationKeys =
  | 'splice'
  | 'push'
  | 'pop'
  | 'shift'
  | 'unshift'

export type FixedLengthArray<
  T,
  L extends number,
  TObj = [T, ...Array<T>],
> = Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>> & {
  readonly length: L
  [I: number]: T
  [Symbol.iterator]: () => IterableIterator<T>
}

// FixmeType is just an alias of 'any'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixmeType = any

// Very simple way to provide a `Maybe` thing
// Again, it's not a Monad or so, just a very simple TS type :)
export type Nothing = null | undefined
export type Maybe<T> = T | Nothing
