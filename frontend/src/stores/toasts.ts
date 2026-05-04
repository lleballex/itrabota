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

let toastId = 0

export const useToastsStore = create<ToastsStore>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `${Date.now()}-${toastId++}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((i) => i.id !== id) })),
}))
