import { createContext } from "react"

interface PopoverContext {
  id: string
}

export const popoverContext = createContext<PopoverContext>(
  {} as PopoverContext
)
