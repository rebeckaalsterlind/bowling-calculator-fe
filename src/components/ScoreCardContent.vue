<template>
  <tr v-for="(player, index) in players" :key="player.id">
    <td class="player-details-container">
      <h5>{{ player.name || `Player ${index + 1}` }}</h5>
      <h6>HDch: {{ player.hdcpFactor || "-" }}</h6>
    </td>
    <td
      v-for="frame in player.game"
      :key="frame.id"
      class="score-box"
      :class="{
        active: !!frame.active,
      }"
      @click="handleActiveIndex(frame.id, player.id)"
    >
      <ScoreFrame :frame="frame" />
    </td>
    <td class="score-box">{{ player.hdcpScore || "-" }}</td>
    <td class="score-box">{{ player.maxPossible }}</td>
  </tr>
</template>
<script lang="ts">
import { defineComponent, toRef } from "vue";
import { usePlayersStore } from "@/store/players";
import CaluculatorHelpers from "../helpers/calculator-helper";
import ScoreFrame from "./ScoreFrame.vue";

export default defineComponent({
  components: { ScoreFrame },
  setup(_, { emit }) {
    const playersStore = usePlayersStore();
    const players = toRef(playersStore, "players");

    const handleActiveIndex = (roundId: number, index: number) => {
      const frameIndex = CaluculatorHelpers.getSelectFrame(index) || roundId;

      emit("activePlayerIndex", index);
      emit("frameIndex", frameIndex);
    };

    return { players, handleActiveIndex };
  },
});
</script>

<style scoped>
.score-box {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  max-height: 80px;
  width: 100%;
  background: white;
}

.player-details-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

tr {
  display: flex;
  flex-direction: row;
  align-items: center;
}

th {
  flex: 1;
  padding: 10px;
}

td {
  height: 80px;
  border: 1px solid #13202d;
  flex: 1;
}
.active {
  border: 4px solid #8f3a0f;
  border-radius: 5px;
}
</style>
