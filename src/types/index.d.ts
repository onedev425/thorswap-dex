/// <reference types="vite-plugin-svgr/client" />

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';

declare type FixMe = any;
declare type Todo = any;
declare type ErrorType = any;
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
