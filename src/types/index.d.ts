/// <reference types="vite-plugin-svgr/client" />

type ArrayLengthMutationKeys = "splice" | "push" | "pop" | "shift" | "unshift";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare type FixMe = any;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare type Todo = any;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare type ErrorType = any;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
declare type NotWorth = any;
declare type Maybe<T> = T | null;
declare type Nothing = null | undefined;

declare type FixedLengthArray<T, L extends number, TObj = [T, ...T[]]> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
  readonly length: L;
  [I: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
};
