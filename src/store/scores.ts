import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";

export const useScoreStore = defineStore("scores", () => {
  const standingPins: Ref<number[]> = ref([...Array(11).keys()]);
  const points: Ref<number> = ref(0);

  return {
    standingPins,
    points,
  };
});
