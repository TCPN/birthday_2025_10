// a pinia store that save user login data into localStorage

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { loginUser, registerUser, type LoginData, type RegisterData, type UserData } from "./api";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserData | null>(null);

  // Load user data from localStorage
  const loadLoginData = () => {
    const data = localStorage.getItem("user");
    const saved = data ? JSON.parse(data) : null;
    if (saved && saved.userId && saved.loginToken) {
      return saved as LoginData;
    }
    return null;
  };

  // Save user data to localStorage
  const saveLoginData = (userData: UserData | null) => {
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = async (loginData: LoginData) => {
    const userData = await loginUser({ userId: loginData.userId, loginToken: loginData.loginToken });
    user.value = userData;
    saveLoginData(userData);

    return userData;
  };

  const register = async (registerData: RegisterData) => {
    const userData = await registerUser(registerData);
    user.value = userData;
    saveLoginData(userData);
    return userData;
  };

  return {
    user: computed(() => user.value),
    login,
    register,
    loadLoginData,
    saveLoginData,
  };
});
