import { Players } from "@/types/score-board";
import { defineStore } from "pinia";

import type { Ref } from "vue";
import { ref } from "vue";
import CaluculatorHelpers from "../helpers/calculator-helper";

export const usePlayersStore = defineStore("players", () => {
  const players: Ref<Players[]> = ref([
    {
      name: "",
      hdcpFactor: 0,
      hdcpScore: null,
      maxPossible: 300,
      id: 1,
      game: CaluculatorHelpers.getRounds(),
    },
  ]);

  return {
    players,
  };
});
