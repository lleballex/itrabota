export type WithRequired<T, Key extends keyof T> = Omit<T, Key> & {
  [K in Key]-?: NonNullable<T[K]>
}
