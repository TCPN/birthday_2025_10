<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 5,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel<number>({ default: 0});
const hoveredValue = ref(0);
</script>

<template>
  <div class="rating-buttons">
    <button
      v-for="n in props.count"
      :key="n"
      type="button"
      :disabled="props.disabled"
      class="star-button"
      :class="{ active: n <= modelValue, 'before-hovered': n <= hoveredValue }"
      @click="!props.disabled ? (modelValue = n) : null"
      @mouseenter="!props.disabled ? (hoveredValue = n) : null"
      @mouseleave="!props.disabled ? (hoveredValue = 0) : null"
    >
      <!-- filled star and hollow star -->
      <span v-if="(hoveredValue === 0 ? n <= modelValue : n <= hoveredValue) && !props.disabled">★</span>
      <span v-else>☆</span>
    </button>
  </div>
</template>

<style scoped>
.rating-buttons {
  display: inline-flex;
}

.star-button {
  font-size: 1.8rem;
  color: #ccc;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
}

.star-button.before-hovered {
  text-shadow: #fff 0px 0px 2px;
}

.star-button.active {
  color: #facc15; /* 選中時金黃色 */
}
</style>
