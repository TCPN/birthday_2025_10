// a pinia store that save user login data into localStorage

import { defineStore } from "pinia";
import { ref } from "vue";
import { getStuffs, rateStuffs, type RatingAnswer } from "./api";
import { randomChoice, randomIndexWithProbTable } from "./random";

type RatingStats = Record<string, { sum: number; count: number }>;

export const useUserStore = defineStore('rating', () => {
  //   const ratingRecords = ref<RatingAnswer[]>([]);
  const ratingStats = ref<RatingStats>({});
  const stuffs = ref<string[]>();
  const bufferedAnswers = ref<RatingAnswer[]>([]);
  const SAVED_KEY = 'rating';

  // Load user data from localStorage
  const loadRatingStats = () => {
    const data = localStorage.getItem(SAVED_KEY);
    const saved = data ? JSON.parse(data) : null;
    if (saved) {
      ratingStats.value = saved;
      return saved;
    }
    return null;
  };

  // Save user data to localStorage
  const saveRatingStats = () => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(ratingStats.value));
  };

  const clearSavedRatingStats = () => {
    ratingStats.value = {};
    localStorage.removeItem(SAVED_KEY);
  };

  const fetchStuffs = async () => {
    const items = await getStuffs();
    stuffs.value = items.map(item => item.name);
  }

  const getNextRatingStuff = () => {
    if (!stuffs.value) {
      return;
    }
    const stuffNames = stuffs.value;
    const unratedStuffs = stuffNames.filter(stuff => {
      return !ratingStats.value[stuff];
    });
    if (unratedStuffs && unratedStuffs.length > 0) {
      return randomChoice(unratedStuffs);
    }
    const averages = stuffNames.map(stuff => {
      const stats = ratingStats.value[stuff];
      if (!stats || stats.count === 0) {
        return 0;
      }
      return stats.sum / stats.count;
    });
    const index = randomIndexWithProbTable(averages);
    if (index === -1) {
      return;
    }
    return stuffNames[index];
  };

  const rateStuff = (name: string, rating: number) => {
    if (!ratingStats.value[name]) {
      ratingStats.value[name] = { sum: 0, count: 0 };
    }
    ratingStats.value[name].sum += rating;
    ratingStats.value[name].count += 1;
    bufferedAnswers.value.push({ name: name, rating });
    saveRatingStats();
  };

  const flushBufferedAnswers = (userId: string) => {
    const answers = bufferedAnswers.value.slice();
    try {
      rateStuffs({ userId, ratings: answers });
      bufferedAnswers.value = [];
      return true;
    } catch (error) {
      console.error("Failed to send ratings:", error);
      return false;
    }
  };

  return {
    ratingStats,
    stuffs,
    bufferedAnswers,
    loadRatingStats,
    saveRatingStats,
    clearSavedRatingStats,
    fetchStuffs,
    getNextRatingStuff,
    rateStuff,
    flushBufferedAnswers,
  };
});
