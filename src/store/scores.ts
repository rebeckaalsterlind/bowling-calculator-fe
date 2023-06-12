import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";

export const useScoreStore = defineStore("scores", () => {
  const standingPins: Ref<number[]> = ref([...Array(11).keys()]);
  const points: Ref<number> = ref(0);

  function $resetPins() {
    standingPins.value = [...Array(11).keys()];
  }

  return {
    standingPins,
    points,
    $resetPins,
  };
});
