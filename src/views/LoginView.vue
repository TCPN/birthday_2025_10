<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "@/utils/userStore";
import { useToast } from "@/utils/useToast";

const emit = defineEmits<{
  (e: 'login-success'): void;
}>();

const isRegisterView = ref(true);
const userId = ref('');
const loginToken = ref('');
const name = ref('');
const duringQuery = ref(false);

const userStore = useUserStore();

watch(() => userStore.user, (newUser) => {
  if (newUser) {
    emit('login-success');
  }
});

function lockButtons(fn: () => void) {
  return async () => {
    if (duringQuery.value) return;
    duringQuery.value = true;
    try {
      await fn();
    } catch (e) {
      console.error(e);
    } finally {
      duringQuery.value = false;
    }
  };
}

const onClickLogin = lockButtons(async () => {
  if (!userId.value) {
    useToast().toast('請填寫帳號');
    return;
  }
  if (!loginToken.value) {
    useToast().toast('請填寫密碼');
    return;
  }
  try {
    await userStore.login({ userId: userId.value, loginToken: loginToken.value });
  } catch (e) {
    useToast().toast(`登入失敗: ${(e as Error).message}`);
    return;
  }
});
const onClickRegister = lockButtons(async () => {
  if (!userId.value) {
    useToast().toast('請填寫帳號');
    return;
  }
  if (!name.value) {
    useToast().toast('請填寫姓名');
    return;
  }
  if (!userId.value.match(/^[a-zA-Z0-9_]{3,20}$/)) {
    useToast().toast('帳號格式錯誤，請使用 3-20 字元的英數字或底線');
    return;
  }
  if (name.value.length > 100) {
    useToast().toast('姓名過長，請限制在 100 字以內');
    return;
  }
  
  try {
    await userStore.register({ userId: userId.value, name: name.value });
  } catch (e) {
    useToast().toast(`註冊失敗: ${(e as Error).message}`);
    return;
  }
});
const onClickHint = lockButtons(() => {
  useToast().toast('請使用 3-20 字元的英數字或底線');
});
</script>

<template>
  <form>
    <div class="tab-bar">
      <label :class="['tab', { active: isRegisterView }]" @click="isRegisterView = true">初次登入</label>
      <label :class="['tab', { active: !isRegisterView }]" @click="isRegisterView = false">重新登入</label>
    </div>
    <label for="userid" class="input-entry">
      <span class="input-label">帳號 <button type="button" class="button button--round button--fill " @click="onClickHint">？</button></span>
      <input class="input" type="text" inputmode="email" id="userid" v-model="userId" autocorrect="off"/>
    </label>
    <label v-if="!isRegisterView" for="loginToken" class="input-entry">
      <span class="input-label">密碼</span>
      <input class="input" type="password" id="loginToken" v-model="loginToken" />
    </label>
    <label v-if="isRegisterView" for="name" class="input-entry">
      <span class="input-label">姓名</span>
      <input class="input" type="text" id="name" v-model="name" />
    </label>
    <div class="button-bar">
      <button
        v-if="!isRegisterView"
        type="button"
        class="button button--fill"
        :disabled="duringQuery"
        @click="onClickLogin"
      >
        登入
      </button>
      <button
        v-if="isRegisterView"
        type="button"
        class="button button--fill"
        :disabled="duringQuery"
        @click="onClickRegister"
      >
        註冊
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.tab-bar {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
  border-bottom: 1px solid #555;
}
.tab {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  &:hover {
    background-color: #7773;
    border-bottom: 2px solid #777;
  }

  &.active {
    border-bottom: 2px solid skyblue;
  }
}
.button-bar {
  margin-top: 16px;
  margin-left: 16px;
  text-align: center;
}
</style>
