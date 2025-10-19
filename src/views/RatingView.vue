<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/utils/userStore";
import { useRatingStore } from "@/utils/ratingStore";
import RatingButtons from "@/components/RatingButtons.vue";
import { useToast } from "@/utils/useToast";

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentStuff = ref('');
const rating = ref(0);
const isButtonLocked = ref(false);

const userStore = useUserStore();
const ratingStore = useRatingStore();

function onSendClick() {
  isButtonLocked.value = true;
  try {
    ratingStore.rateStuff(currentStuff.value, rating.value);
    currentStuff.value = ratingStore.getNextRatingStuff();
    rating.value = 0;
  } finally {
    isButtonLocked.value = false;
  }
}

function onCloseClick() {
  emit('close');
  const userId = userStore.user?.userId;
  if (userId) {
    if (ratingStore.bufferedAnswers.length <= 0) {
      return;
    }
    const count = ratingStore.bufferedAnswers.length;
    useToast().toast(`正在送出 ${count} 項評分...`);
    ratingStore.flushBufferedAnswers(userId).then((result) => {
      if (result.points !== -1 && userStore.user) {
        userStore.user.points = result.points;
        useToast().toast(`已獲得 ${count} 點`);
      }
    }).catch((error) => {
      useToast().toast(`評分送出失敗: ${error.message}`);
    });
  }
}

onMounted(async () => {
  currentStuff.value = ratingStore.getNextRatingStuff();
});
</script>

<template>
  <form class="rating-view">
    <div class="header">
    </div>
    <div class="rating-text">
      <div v-if="!currentStuff">
        目前沒有可評分項目
      </div>
      <template v-else>
        <span>你是否喜歡這項天賦...</span>
        <div class="stuff-name">
          {{ currentStuff }}
        </div>
      </template>
    </div>
    <RatingButtons :disabled="!currentStuff" v-model="rating" />
    <div class="button-bar">
      <button
        type="button"
        class="button button--fill"
        :disabled="!currentStuff || rating <= 0 || isButtonLocked"
        @click="onSendClick"
      >
        確定
      </button>
    </div>
    <div class="control-panel">
      <button
        type="button"
        class="button button--border"
        @click="onCloseClick"
      >
        {{ ratingStore.bufferedAnswers.length > 0 ? '完成並獲得點數' : '關閉' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.rating-view {
  display: grid;
  grid-template-rows: auto 1fr auto auto auto;
  place-items: center;
}
.rating-text {
  text-align: center;
  font-weight: bold;
  margin-top: 3rem;
}
.stuff-name {
  margin: 0.5rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text--highlight);
}
.button-bar {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.control-panel {
  margin-top: 2rem;
  display: grid;
  justify-items: center;
}
</style>
