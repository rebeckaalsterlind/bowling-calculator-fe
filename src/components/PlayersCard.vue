<template>
  <div>
    <button @click="handleAddPlayer">Add player</button>
    <div v-if="showAddPlayer">
      <input v-model="playerName" type="text" placeholder="Name..." />
      <input v-model="playerHdcp" type="number" placeholder="HDcp" />
      <button @click="handleSavePlayer">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, ComputedRef, watch } from "vue";
import { defineComponent, toRef, ref, computed } from "vue";
import { usePlayersStore } from "@/store/players";
import CaluculatorHelpers from "../helpers/calculator-helper";
import type { Rounds } from "@/types/score-board";

export default defineComponent({
  setup() {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");
    const showAddPlayer = ref(false);
    const playerName = ref("");
    const playerHdcp = ref(0);
    const randomId = Math.floor(Math.random() * 100 + 1);
    const handleAddPlayer = () => {
      showAddPlayer.value = true;
    };

    const handleSavePlayer = () => {
      players.value.push({
        name: playerName.value,
        hdcp: playerHdcp.value,
        id: randomId,
        game: CaluculatorHelpers.getRounds(),
      });
    };

    return {
      handleAddPlayer,
      showAddPlayer,
      handleSavePlayer,
      playerName,
      playerHdcp,
    };
  },
});
</script>
