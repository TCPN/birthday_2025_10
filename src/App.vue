<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { computed, onMounted, ref, toRef } from "vue";
import { useUserStore } from "./utils/userStore";
import LoginView from "./views/LoginView.vue";
import RatingView from "./views/RatingView.vue";
import TransferView from "./views/TransferView.vue";
import { useToast } from "./utils/useToast";
import ToastContainer from "./components/ToastContainer.vue";
import { randomChoice, randomInt, randomString } from "./utils/random";
import { useRatingStore } from "./utils/ratingStore";

const userStore = useUserStore();
const ratingStore = useRatingStore();

enum ViewState {
  Loading,
  Login,
  Main,
  Rating,
  Transfer,
}

const ratingReady = toRef(() => ratingStore.ready);
const viewState = ref(ViewState.Loading);
const loginSuccess = computed(() => !!userStore.user);
const canRefresh = ref(true);
const isRefreshing = ref(false);

const savedUserId = ref('');

const onClickRefresh = async () => {
  if (!canRefresh.value || !userStore.user) {
    return;
  }
  canRefresh.value = false;
  try {
    await userStore.login(userStore.user);
    useToast().toast(`目前點數: ${userStore.user?.points ?? 0}`);
  } catch (e) {
    useToast().toast(`更新失敗: ${(e as Error).message}`);
  } finally {
    setTimeout(() => {
      canRefresh.value = true;
    }, 10000);
  }
};

onMounted(async () => {
  // Attempt auto-login
  
  try {
    const saved = userStore.loadLoginData();
    if (!saved) {
      viewState.value = ViewState.Login;
    } else {
      savedUserId.value = saved.userId;
      await userStore.login(saved);
      if (!userStore.user) {
        viewState.value = ViewState.Login;
      } else {
        viewState.value = ViewState.Main;
      }
    }
  } catch (e) {
    console.error("Auto login failed:", e);
    viewState.value = ViewState.Login;
  }
});
</script>

<template>
  <div class="app-root">
    <!-- <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    /> -->

    <div v-if="viewState === ViewState.Loading" class="wrapper">
      <div class="loading-text">正在登入{{ savedUserId }}...</div>
    </div>
    <LoginView
      v-else-if="viewState === ViewState.Login"
      @login-success="viewState = ViewState.Main"
    />

    <div v-else-if="viewState === ViewState.Main" class="wrapper">
      <div class="greeting-text">
        Hello, {{ userStore.user?.name ?? '陌生人' }}
      </div>
      <div class="info-text">
        你有 {{ userStore.user?.points ?? 0 }} 點
        <button
          class="button button--small"
          :disabled="!canRefresh"
          @click="onClickRefresh"
        >
          更新
        </button>
      </div>
      <div class="button-bar">
        <button
          type="button"
          class="button button--fill"
          :disabled="!ratingReady"
          @click="viewState = ViewState.Rating"
        >
          去評分
        </button>
        <button
          type="button"
          class="button button--fill"
          @click="viewState = ViewState.Transfer"
        >
          點數轉移
        </button>
        <!-- <button
          type="button"
          class="button button--fill"
          @click="useToast().toast(`這是一個測試 Toast 訊息 ${randomString(randomChoice([3, 10, 20, 50, 100]) ?? 3)}`)"
        >
          測試 Toast
        </button> -->
      </div>
      <!-- <nav> -->
        <!-- <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink> -->
      <!-- </nav> -->
    </div>

    <RatingView
      v-else-if="viewState === ViewState.Rating"
      @close="viewState = ViewState.Main"
    />

    <TransferView
      v-else-if="viewState === ViewState.Transfer"
      @close="viewState = ViewState.Main"
    />
  </div>

  <ToastContainer class="toast-container" />

  <!-- <RouterView /> -->
</template>

<style scoped>
.app-root {
  line-height: 1.5;
  max-height: 100vh;
  user-select: none;
  display: grid;
  place-items: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.toast-container {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 80vw;
  max-height: 70vh;
}

.loading-text,
.greeting-text {
  margin: 1rem 0;
  font-size: 2rem;
  font-weight: bold;
}

.greeting-text {
  color: goldenrod;
}

.button-bar {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.info-text {
  margin: 1rem 0;
  font-size: 1.2rem;
}

.wrapper {
  display: grid;
  grid-template-rows: auto auto auto;
  place-items: center;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
/* 
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
