import { create } from "zustand"

interface Toast {
  id: string
  message: string
  type: "success" | "danger"
}

interface ToastsStore {
  toasts: Toast[]
  addToast: (val: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

export const useToastsStore = create<ToastsStore>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: String(state.toasts.length + 1) },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((i) => i.id !== id) })),
}))
