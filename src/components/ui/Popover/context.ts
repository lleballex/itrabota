import { createContext, useContext } from "react"

interface PopoverContext {
  id: string
}

export const PopoverContext = createContext<PopoverContext>(
  {} as PopoverContext
)

export const usePopover = () => useContext(PopoverContext)
