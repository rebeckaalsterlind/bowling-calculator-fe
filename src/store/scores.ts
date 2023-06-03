import { defineStore } from "pinia";

import type { Ref } from "vue";
import { ref } from "vue";
export const useScoreStore = defineStore("scores", () => {
  const activeRound: Ref<number> = ref(1);
  const standingPins: Ref<number[]> = ref([...Array(11).keys()]);
  const points: Ref<number> = ref(0);
  const selectedPins: Ref<number> = ref(0);

  return {
    activeRound,
    standingPins,
    points,
    selectedPins,
  };
});
