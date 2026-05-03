import { createContext, useContext } from "react"

export const DrawerContext = createContext<{
  onIsActiveChange: (val: boolean) => void
}>({
  onIsActiveChange: () => undefined,
})

export const useDrawer = () => useContext(DrawerContext)
