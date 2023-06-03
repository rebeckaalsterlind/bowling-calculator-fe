import { defineStore } from "pinia";

import type { Ref } from "vue";
import { ref } from "vue";
export const usePlayersStore = defineStore("players", () => {
  const players: Ref<number> = ref(1);

  return {
    players,
  };
});
