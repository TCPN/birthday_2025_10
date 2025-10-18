<template>
  <div class="fixed top-4 right-4 flex flex-col gap-2 z-50 toast-container-root">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="px-4 py-2 rounded-lg shadow text-white toast"
        :class="toastColor(item.type)"
      >
        {{ item.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/utils/useToast"

const { toasts } = useToast()

function toastColor(type?: string) {
  switch (type) {
    case "success":
      return "bg-green-500"
    case "error":
      return "bg-red-500"
    default:
      return "bg-gray-800"
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.toast-container-root {
  pointer-events: none;
  user-select: none;
}

.toast {
  border-radius: 4px;
  padding: 4px 12px;
  margin: 6px 0;
  background-color: #333d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  user-select: none;
  word-wrap: break-word;
}
</style>
