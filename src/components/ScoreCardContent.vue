<template>
  <tr
    v-for="(player, index) in players"
    :key="player.id"
    :class="{
      'active-player': activePlayerIndex === player.id,
    }"
  >
    <td class="player-details-container">
      <h5>{{ player.name || `Player ${index + 1}` }}</h5>
      <h6>HDch: {{ player.hdcpFactor || "-" }}</h6>
    </td>
    <td
      v-for="frame in player.game"
      :key="frame.id"
      class="score-box"
      :class="{
        'active-frame': !!frame.active,
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
import { defineComponent, onMounted, toRef } from "vue";
import { usePlayersStore } from "@/store/players";
import { useScoreStore } from "@/store/scores";

import CaluculatorHelpers from "../helpers/calculator-helper";
import ScoreFrame from "./ScoreFrame.vue";

export default defineComponent({
  components: { ScoreFrame },
  setup() {
    const playersStore = usePlayersStore();
    const scoresStore = useScoreStore();
    const players = toRef(playersStore, "players");
    const activePlayerIndex = toRef(playersStore, "activePlayerIndex");
    const frameId = toRef(scoresStore, "frameId");

    const handleActiveIndex = (roundId: number, index: number) => {
      activePlayerIndex.value = index;
      frameId.value = CaluculatorHelpers.getFirstUnplayedFrame() || roundId;
    };

    onMounted(() => CaluculatorHelpers.getFirstUnplayedFrame());
    return { players, handleActiveIndex, activePlayerIndex };
  },
});
</script>

<style scoped lang="scss">
.active-player {
  box-shadow: 2px 0 5px#13202d;
  .active-frame {
    border: 2px solid #8f3a0f;
  }
}
.player-details-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}
.score-box {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  max-height: 80px;
  width: 100%;
  background: white;
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
</style>
