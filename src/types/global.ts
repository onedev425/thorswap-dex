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

// FixmeType is just an alias of 'any'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixmeType = any

// Very simple way to provide a `Maybe` thing
// Again, it's not a Monad or so, just a very simple TS type :)
export type Nothing = null | undefined
export type Maybe<T> = T | Nothing
