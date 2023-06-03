import { Players } from "@/types/score-board";
import { defineStore } from "pinia";

import type { Ref, ComputedRef } from "vue";
import { ref, computed } from "vue";
import type { Rounds } from "@/types/score-board";
import CaluculatorHelpers from "../helpers/calculator-helper";

export const usePlayersStore = defineStore("players", () => {
  const players: Ref<Players[]> = ref([
    {
      name: "First Player",
      hdcp: 0,
      id: 1,
      game: CaluculatorHelpers.getRounds(),
    },
  ]);

  return {
    players,
  };
});
