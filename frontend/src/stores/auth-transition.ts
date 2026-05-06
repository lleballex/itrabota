import { create } from "zustand"

interface AuthTransitionStore {
  isLoggingOut: boolean
  startLogout: () => void
  finishLogout: () => void
}

export const useAuthTransitionStore = create<AuthTransitionStore>((set) => ({
  isLoggingOut: false,

  startLogout: () => set({ isLoggingOut: true }),

  finishLogout: () => set({ isLoggingOut: false }),
}))
