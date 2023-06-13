import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";

export const useScoreStore = defineStore("scores", () => {
  const standingPins: Ref<number[]> = ref([...Array(11).keys()]);
  const points: Ref<number> = ref(0);
  const frameId: Ref<number> = ref(1);

  function $resetPins() {
    standingPins.value = [...Array(11).keys()];
  }

  // function $nextRound
  const $nextRound = () => {
    $resetPins();
    frameId.value++;
  };

  return {
    standingPins,
    points,
    frameId,
    $resetPins,
    $nextRound,
  };
});
