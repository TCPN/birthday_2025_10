import { ref, readonly } from "vue"

export interface Toast {
  id: number
  message: string
  type?: "success" | "error" | "info"
  duration?: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
  function toast(message: string, options: Omit<Toast, "id" | "message"> = {}) {
    const id = ++idCounter
    const newToast: Toast = {
      id,
      message,
      type: options.type || "info",
      duration: Number.isFinite(options.duration) ? options.duration : 3000,
    }

    toasts.value.push(newToast)

    // 自動移除
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts: readonly(toasts),
    toast,
    removeToast,
  }
}
