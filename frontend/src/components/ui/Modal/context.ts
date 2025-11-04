import { createContext, useContext } from "react"

interface ModalContext {
  onIsActiveChange: (val: boolean) => void
}

export const ModalContext = createContext<ModalContext | null>(null)

export const useModal = () => {
  const context = useContext(ModalContext)

  if (!context) {
    throw new Error("Modal components must be used within Modal.Root")
  }

  return context
}
