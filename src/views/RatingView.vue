<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/utils/userStore";

const isRegisterView = ref(true);
const userId = ref('');
const loginToken = ref('');
const name = ref('');
const duringQuery = ref(false);

const userStore = useUserStore();

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

const onClickLogin = lockButtons(() => userStore.login({ userId: userId.value, loginToken: loginToken.value }));
const onClickRegister = lockButtons(() => userStore.register({ userId: userId.value, name: name.value }));
</script>

<template>
  <form>
    <div class="tab-bar">
      <label :class="['tab', { active: isRegisterView }]" @click="isRegisterView = true">註冊</label>
      <label :class="['tab', { active: !isRegisterView }]" @click="isRegisterView = false">登入</label>
    </div>
    <label for="userid" class="input-entry">
      <span>帳號: </span>
      <input class="input" type="text" id="userid" v-model="userId" />
    </label>
    <label v-if="!isRegisterView" for="loginToken" class="input-entry">
      <span>密碼: </span>
      <input class="input" type="password" id="loginToken" v-model="loginToken" />
    </label>
    <label v-if="isRegisterView" for="name" class="input-entry">
      <span>姓名: </span>
      <input class="input" type="text" id="name" v-model="name" />
    </label>
    <div class="button-bar">
      <button v-if="!isRegisterView" type="button" :disabled="duringQuery" @click="onClickLogin">登入</button>
      <button v-if="isRegisterView" type="button" :disabled="duringQuery" @click="onClickRegister">註冊</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.tab-bar {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
.tab {
  padding: 12px 16px;
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
.input-entry {
  display: block;
  margin: 8px 0;
}
.input {
  color: white;
  background-color: transparent;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 4px 8px;
}
.button-bar {
  margin-top: 16px;
  margin-left: 16px;
  text-align: center;

  button {
    color: inherit;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #333;
    cursor: pointer;

    &:hover {
      background-color: #555;
    }

    &:disabled {
      opacity: 0.6;
      background-color: #5557;
      cursor: default;
      // color: #7774;
    }
  }
}
</style>
