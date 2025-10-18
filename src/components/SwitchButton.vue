<template>
  <label class="switch" @click="toggle">
    <input type="checkbox" :checked="modelValue" @change="toggle" />
    <span class="slider"></span>
    <span class="label"><slot /></span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})

const emit = defineEmits(['update:modelValue'])

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
}

.switch input {
  display: none;
}

.slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 9999px;
  transition: background-color 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider::before {
  transform: translateX(20px);
}

.label {
  font-size: 14px;
}
</style>
