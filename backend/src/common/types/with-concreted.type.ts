export type WithConcreted<T, Key extends keyof T, Type extends T[Key]> = Omit<
  T,
  Key
> & {
  [K in Key]: Type
}
