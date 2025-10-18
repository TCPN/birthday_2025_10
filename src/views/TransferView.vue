<script setup lang="ts">
import { useApi } from '@/utils/useApi';
import { useUserStore } from '@/utils/userStore';
import { useToast } from '@/utils/useToast';
import { ref, useTemplateRef } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const userStore = useUserStore();

const toUserIdInput = useTemplateRef<HTMLInputElement>('toUserId');
const amountInput = useTemplateRef<HTMLInputElement>('amount');

const isDuringTransfer = ref(false);

const onSubmit = async () => {
  if (!userStore.user) {
    throw new Error('使用者未登入');
  }
  if (!toUserIdInput.value || !toUserIdInput.value.value) {
    useToast().toast('請填寫轉移對象');
    return;
  }
  if (!amountInput.value || !amountInput.value.value) {
    useToast().toast('請填寫轉移點數數量');
    return;
  }
  if (!(parseInt(amountInput.value.value) >= 1)) {
    useToast().toast('轉移數量必須大於 0');
    return;
  }
  isDuringTransfer.value = true;
  const fromUserId = userStore.user.userId;
  const toUserId = toUserIdInput.value.value;
  const amount = parseInt(amountInput.value.value);
  try {
    const result = await useApi().transferPoints({
      from: fromUserId,
      to: toUserId,
      amount,
    });
    useToast().toast(`已將 ${amount} 點轉移給 ${toUserId}`);
    userStore.user.points = result.points;
    emit('close');
  } catch (e: any) {
    useToast().toast(`轉移失敗: ${e.message}`);
    return;
  } finally {
    isDuringTransfer.value = false;
  }
}
</script>

<template>
  <div class="transfer-view">
    <h2>轉移點數</h2>
    <div class="hint-text">目前點數: {{ userStore.user?.points ?? 0 }}</div>
    <form>
      <label for="targetUserId" class="input-entry">
        <span class="input-label">目標使用者 ID</span>
        <input class="input" type="text" ref="toUserId" value="bank"/>
      </label>
      <label for="pointsAmount" class="input-entry">
        <span class="input-label">轉移點數數量</span>
        <input class="input" type="number" ref="amount" min="1" value="1"/>
      </label>
      <div class="button-bar">
        <button 
          type="button"
          class="button button--fill"
          :disabled="isDuringTransfer"
          @click="onSubmit"
        >
          確定
        </button>
        <button 
          type="button"
          class="button button--border"
          @click="emit('close')"
        >
          {{ isDuringTransfer ? '關閉' : '取消' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.transfer-view {
  display: grid;
  grid-auto-rows: auto;
  place-items: flex-start;
  width: max-content
}
.hint-text {
  font-size: 12px;
  margin: 1em 0 0.3em;
  color: #888;
}
</style>
